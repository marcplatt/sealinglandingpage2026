import Link from 'next/link'

import { ConversionPing } from './ConversionPing'
import { TrackedPhoneLink } from '../../components/TrackedPhoneLink'

export default function ThankYouPage() {
  return (
    <main className="lp-shell">
      <ConversionPing />
      <section className="form-wrap">
        <article className="lp-panel form-panel">
          <h1>Thanks. Your quote request is in.</h1>
          <p>
            We received your details and will reach out shortly. If you need an
            answer right away, call <TrackedPhoneLink href="tel:+12507436349">250.743.6349</TrackedPhoneLink>.
          </p>
          <p>
            <Link className="btn btn-solid" href="/concrete-sealing-cowichan">
              Back to Concrete Sealing
            </Link>
          </p>
        </article>
      </section>
    </main>
  )
}