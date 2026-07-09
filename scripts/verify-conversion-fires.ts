import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readEnvLocal(key: string) {
  const envPath = resolve(process.cwd(), '.env.local')
  const content = readFileSync(envPath, 'utf8')
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}=`))

  if (!line) {
    return ''
  }

  return line.slice(key.length + 1).trim()
}

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:3000'
const expectedLabel = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL ?? readEnvLocal('NEXT_PUBLIC_GADS_CONVERSION_LABEL')

if (!expectedLabel) {
  throw new Error('NEXT_PUBLIC_GADS_CONVERSION_LABEL is not set')
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const conversionRequests: string[] = []

  page.on('request', (request) => {
    const url = request.url()
    if (
      !url.includes('googleadservices.com') &&
      !url.includes('googletagmanager.com') &&
      !url.includes('google.com/pagead')
    ) {
      return
    }
    if (!url.includes('conversion') && !url.includes('send_to')) {
      return
    }
    conversionRequests.push(url)
  })

  await page.goto(`${baseUrl}/concrete-sealing-cowichan`, { waitUntil: 'networkidle' })
  await page.getByLabel('First name').fill('Taylor')
  await page.getByLabel('Last name').fill('Prospect')
  await page.getByLabel('Email').fill('taylor.prospect@example.com')
  await page.getByLabel('Phone').fill('250-555-0199')
  await page.getByLabel('Address').fill('123 Demo Street, Duncan, BC')
  await page.getByLabel('What services do you need?').fill('Concrete sealing estimate for a driveway.')
  await Promise.all([
    page.waitForURL('**/thank-you*', { timeout: 10000 }),
    page.getByRole('button', { name: 'Request Your Quote' }).click(),
  ])
  await page.waitForTimeout(1500)

  const matchedRequest = conversionRequests.find((url) => url.includes(encodeURIComponent(expectedLabel)) || url.includes(expectedLabel))
  await browser.close()

  if (!matchedRequest) {
    throw new Error(`No conversion request matched ${expectedLabel}. Seen: ${conversionRequests.join('\n')}`)
  }

  console.log(`PASS ${matchedRequest}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})