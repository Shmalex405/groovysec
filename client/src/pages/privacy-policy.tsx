import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 px-6 py-20">
      {/* Header + logo */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <img
          src="/transparent_logo.png"
          alt="Groovy Security Logo"
          className="mx-auto w-32 h-32 mb-6 opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
        <h1 className="text-4xl font-bold text-blue-400">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mt-2">
          This Privacy Policy explains how Groovy Security collects, uses, and
          protects your personal data when you interact with our website and
          services.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 text-left">
        {/* What data do we collect */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            What data do we collect?
          </h2>
          <p className="text-slate-300 mb-2">
            We may collect the following categories of personal data:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>
              Personal identification information (such as name, email address,
              phone number and similar contact details).
            </li>
            <li>
              Payment information in connection with purchases, subscriptions or
              other paid services.
            </li>
          </ul>
        </section>

        {/* How do we collect your data */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            How do we collect your data?
          </h2>
          <p className="text-slate-300 mb-2">
            You directly provide most of the data we collect. We collect and
            process data when you:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>
              Register online or place an order for our products or services.
            </li>
            <li>
              Voluntarily complete customer surveys or provide feedback by
              email, forms or message boards.
            </li>
            <li>
              Use or view our website, where cookies and similar technologies
              may collect usage information.
            </li>
            <li>Book a pilot, demo or consultation of our product.</li>
          </ul>
          <p className="text-slate-300 mt-3">
            We may also receive data indirectly from lead generation and
            prospecting tools used for business development.
          </p>
        </section>

        {/* How will we use your data */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            How do we use your data?
          </h2>
          <p className="text-slate-300 mb-2">
            Groovy Security uses your data to:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Process orders, provision services and manage your account.</li>
            <li>
              Communicate with you regarding product updates, support and
              features we believe may be relevant.
            </li>
            <li>
              Incorporate voluntary feedback into the ongoing development of our
              products.
            </li>
          </ul>
          <p className="text-slate-300 mt-3">
            Where you choose to interact with AI models through our platform,
            successful AI prompts may be shared with the AI provider you have
            selected so that they can offer and improve their services.
          </p>
        </section>

        {/* Storage and security */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            How do we store and protect your data?
          </h2>
          <p className="text-slate-300 mb-3">
            We host customer data on Amazon Web Services (AWS) in either{" "}
            <span className="font-medium">
              EU-West-1 (Ireland) or US-West-2 (Oregon)
            </span>{" "}
            depending on the organization’s primary region.
          </p>
          <p className="text-slate-300 mb-3">
            Each customer organization is provisioned with its own dedicated,
            encrypted S3 bucket, database and compliance engine, protected by a
            unique AWS KMS key. Data is encrypted at rest (AES-256 via KMS) and
            in transit (TLS 1.2/1.3).
          </p>
          <p className="text-slate-300 mb-3">
            Access is limited using role-based access control (RBAC), strict
            least-privilege IAM policies, private VPC networking and continuous
            monitoring through AWS CloudTrail, GuardDuty and internal logging.
            Our architecture is designed to support compliance with standards
            such as HIPAA, GDPR and ISO&nbsp;27001.
          </p>
          <p className="text-slate-300">
            We retain your personal data only for as long as there is a
            contractual or legitimate business need. At the end of the retention
            period, we aim to delete or anonymize personal data within 30 days.
          </p>
        </section>

        {/* Marketing */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            Marketing communications
          </h2>
          <p className="text-slate-300 mb-3">
            We may send you information about Groovy Security products and
            services that we think you may find useful. You can opt out of
            marketing communications at any time by using the unsubscribe links
            in our emails or by contacting us directly.
          </p>
        </section>

        {/* Data protection rights */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            Your data protection rights
          </h2>
          <p className="text-slate-300 mb-2">
            We want to ensure that you are fully aware of your rights under
            applicable data protection laws (such as GDPR). Subject to certain
            conditions, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Request access to the personal data we hold about you.</li>
            <li>
              Request correction of information you believe is inaccurate or
              incomplete.
            </li>
            <li>
              Request deletion of your personal data in certain circumstances.
            </li>
            <li>
              Request that we restrict the processing of your personal data.
            </li>
            <li>
              Object to our processing of your personal data, including
              marketing.
            </li>
            <li>
              Request that we transfer your data to another organization or
              directly to you (data portability).
            </li>
          </ul>
          <p className="text-slate-300 mt-3">
            If you exercise these rights, we will respond as required by law,
            typically within one month. To make a request, please contact us
            using the details in the{" "}
            <span className="italic">How to contact us</span> section below.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            Cookies and similar technologies
          </h2>
          <p className="text-slate-300 mb-3">
            Cookies are small text files placed on your device that help us
            understand how you use our website and enable certain features (such
            as keeping you signed in). We may also use cookies or analytics to
            understand usage patterns and improve the site.
          </p>
          <p className="text-slate-300 mb-3">
            We use a mix of functional cookies (for things like language or
            region preferences) and, where applicable, analytics or advertising
            cookies that help us understand how visitors interact with our
            content.
          </p>
          <p className="text-slate-300">
            You can configure your browser to refuse cookies or to notify you
            when cookies are being set. Some features of the site may not work
            properly if cookies are disabled.
          </p>
        </section>

        {/* Other sites */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            Links to other websites
          </h2>
          <p className="text-slate-300">
            Our website may contain links to third-party websites. This Privacy
            Policy applies only to Groovy Security. If you follow a link to
            another website, we recommend that you read their privacy policy.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            Changes to this Privacy Policy
          </h2>
          <p className="text-slate-300">
            We keep this Privacy Policy under regular review and will post any
            updates on this page. The current version was last updated on{" "}
            <span className="font-medium">15 September 2025</span>.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            How to contact us
          </h2>
          <p className="text-slate-300 mb-2">
            If you have any questions about this Privacy Policy, the data we
            hold about you, or if you wish to exercise your data protection
            rights, please contact us at:
          </p>
          <p className="text-slate-300">
            Email:{" "}
            <a
              href="mailto:support@groovysec.com"
              className="text-blue-400 underline"
            >
              support@groovysec.com
            </a>
          </p>
        </section>

        {/* Authority */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            How to contact the appropriate authority
          </h2>
          <p className="text-slate-300">
            If you wish to raise a concern or make a complaint about how we
            handle your personal data, you may contact the relevant data
            protection authority in your jurisdiction. If you are based in the
            United Kingdom or European Union, this may be your local data
            protection regulator or supervisory authority.
          </p>
        </section>

        <p className="text-slate-500 text-sm mt-12 text-center">
          Last updated: 15 September 2025
        </p>
      </div>
    </main>
  );
}