import React from "react";
import { PageTransition } from "@/components/motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { usePageMeta } from "@/lib/use-page-meta";

export default function PrivacyPolicy() {
  usePageMeta(
    "Privacy Policy",
    "How Groovy Security collects, uses, and protects your personal data."
  );
  return (
    <PageTransition>
    <Navigation />
    <main className="min-h-screen text-[#0F1B2D] px-6 pt-32 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 border-b border-[#0F1B2D]/10 pb-10">
        <h1 className="text-4xl font-bold text-[#0F1B2D]">Privacy Policy</h1>
        <p className="text-[#51617A] text-sm mt-2">
          This Privacy Policy explains how Groovy Security, Inc. (“Groovy
          Security”, “we”) collects, uses, and protects your personal data
          when you interact with our website and services.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 text-left">
        {/* Scope */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Who this policy covers
          </h2>
          <p className="text-[#51617A] mb-3">
            This policy covers the personal data we are responsible for:
            visitors to groovysec.com, people who contact us or ask for a
            demo, and the administrators and billing contacts of our
            customers.
          </p>
          <p className="text-[#51617A]">
            When an organization uses Whiteout AI, the prompts, files and
            activity records of its users belong to that organization. We
            process that data on the organization’s behalf, under our
            agreement with it, and the organization decides how it is used
            and how long it is kept. If your employer uses Whiteout AI and you
            have a question about that data, please ask your employer first.
            We will help them respond.
          </p>
        </section>

        {/* What data do we collect */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            What data do we collect?
          </h2>
          <p className="text-[#51617A] mb-2">
            We may collect the following categories of personal data:
          </p>
          <ul className="list-disc list-inside text-[#51617A] space-y-1">
            <li>
              Personal identification information (such as name, email address,
              phone number and similar contact details).
            </li>
            <li>
              Payment information in connection with purchases, subscriptions or
              other paid services.
            </li>
            <li>
              Job title, where you choose to give it. This is optional and the form
              works without it.
            </li>
            <li>
              Company name and size, and what you tell us about how your
              organization uses AI, when you ask for a demo or contact us.
            </li>
            {/* TEMP: Maestro unpublished 2026-09-02 — the download form is off, so
                this describes collection that no longer happens. Restore with the
                form. See the note on the "Downloading Maestro" section below. */}
            {/* <li>
              For Maestro downloads: the IP address the request came from, the
              version and platform you were offered, and the fact and time that you
              accepted these terms.
            </li> */}
          </ul>
        </section>

        {/* TEMP: Maestro unpublished 2026-09-02 — the /maestro/install form this
            section documents is no longer reachable, so it is hidden with the rest.
            NOTE: records collected while the form was live still exist; if that
            retention needs to stay disclosed, restore a trimmed past-tense version
            of this section rather than leaving it hidden. Flagged for Alex. */}
        {/* Specific because the download form asks people to accept this policy,
            so the policy has to actually describe what that form does. */}
        {/* <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Downloading Maestro
          </h2>
          <p className="text-[#51617A] mb-2">
            Maestro is free, and the form before the download asks for your name,
            work email and — optionally — your job title. We use it to understand who
            is using Maestro and to tell you about releases that matter. We do not
            sell it, and we do not share it with third parties for their own
            marketing.
          </p>
          <p className="text-[#51617A] mb-2">
            Alongside what you type we record the IP address of the request, the
            version and platform offered to you, and that you accepted these terms.
            The IP address is kept so we can investigate abuse of a public form.
            Records are stored in our own AWS account, encrypted at rest.
          </p>
          <p className="text-[#51617A]">
            Maestro itself sends us nothing. It runs on your machine, and your
            assessment findings, target details and credentials stay there — the form
            is the only point at which we learn anything, and it happens before you
            have run the tool at all.
          </p>
        </section> */}

        {/* How do we collect your data */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            How do we collect your data?
          </h2>
          <p className="text-[#51617A] mb-2">
            You directly provide most of the data we collect. We collect and
            process data when you:
          </p>
          <ul className="list-disc list-inside text-[#51617A] space-y-1">
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
          <p className="text-[#51617A] mt-3">
            We may also receive data indirectly from lead generation and
            prospecting tools used for business development.
          </p>
        </section>

        {/* How will we use your data */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            How do we use your data?
          </h2>
          <p className="text-[#51617A] mb-2">
            Groovy Security uses your data to:
          </p>
          <ul className="list-disc list-inside text-[#51617A] space-y-1">
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
          <p className="text-[#51617A] mt-3">
            Where you choose to interact with AI models through our platform,
            prompts that pass our compliance checks are sent to the AI provider
            you have selected so that it can respond. That provider handles them
            under its own terms and privacy policy. Groovy Security does not use
            your prompts or other content to train AI models, and we do not train
            AI models.
          </p>
        </section>

        {/* Storage and security */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            How do we store and protect your data?
          </h2>
          <p className="text-[#51617A] mb-2">
            We host customer data on Amazon Web Services (AWS). Each customer
            organization’s data is stored in one region, agreed when the
            organization is set up and written in its order:
          </p>
          <ul className="list-disc list-inside text-[#51617A] space-y-1 mb-3">
            <li>
              <span className="font-medium">United States:</span> US West
              (Oregon), <span className="font-medium">us-west-2</span>.
            </li>
            <li>
              <span className="font-medium">European Union:</span> Europe
              (Stockholm, Sweden),{" "}
              <span className="font-medium">eu-north-1</span>.
            </li>
            <li>
              <span className="font-medium">Your own AWS account:</span> with a
              Client-Hosted deployment, Whiteout AI runs in your AWS account,
              in the region you choose, and your data stays there.
            </li>
          </ul>
          <p className="text-[#51617A] mb-3">
            We do not move a customer’s data to another region unless the
            customer agrees. If we add a hosting region, we will update this
            policy before any customer data is stored there.
          </p>
          <p className="text-[#51617A] mb-3">
            On every plan, each customer organization has its own database and
            its own AWS KMS encryption key. On the Standard and Plus plans the
            servers and checking engine are shared between organizations. With
            a Groovy-Hosted deployment they are yours alone. Data is encrypted
            at rest (AES-256 via KMS) and in transit between your users and our
            platform (TLS 1.2 or 1.3).
          </p>
          <p className="text-[#51617A] mb-3">
            Access is limited using role-based access control (RBAC) in the
            product, restricted administrative access to our AWS environment and
            private VPC networking. We monitor the environment with AWS
            CloudTrail, Amazon GuardDuty, AWS Security Hub and internal logging.
            Our architecture is designed to support compliance with standards
            such as HIPAA, GDPR and ISO&nbsp;27001.
          </p>
          <p className="text-[#51617A]">
            We retain your personal data only for as long as there is a
            contractual or legitimate business need. When that need ends, or when
            you ask us to delete it (see{" "}
            <span className="italic">Your data protection rights</span> below), we
            delete or anonymize it and confirm to you when it is done.
          </p>
          <p className="text-[#51617A] mt-3">
            Customer organizations set how long their AI activity records are
            kept in Whiteout AI. When a customer’s agreement ends, we return or
            delete that customer’s data as the agreement sets out.
          </p>
        </section>

        {/* Sharing */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Who do we share data with?
          </h2>
          <p className="text-[#51617A] mb-3">
            We do not sell personal data, and we do not share it with third
            parties for their own marketing.
          </p>
          <p className="text-[#51617A] mb-3">
            We use a small number of service providers to run our website and
            services, such as Amazon Web Services for hosting and a provider
            that delivers our email. They may handle personal data only to
            provide that service to us. The providers that handle a customer’s
            data are listed in that customer’s data processing agreement.
          </p>
          <p className="text-[#51617A]">
            We may also disclose personal data where the law requires us to.
          </p>
        </section>

        {/* Transfers */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            International transfers
          </h2>
          <p className="text-[#51617A] mb-3">
            Groovy Security is based in the United States. If you contact us or
            ask for a demo from another country, the details you give us are
            processed in the United States.
          </p>
          <p className="text-[#51617A]">
            Customer data stays in the hosting region described above. Where
            European or UK data protection law applies and a transfer needs a
            safeguard, we rely on the European Commission’s Standard
            Contractual Clauses and the UK International Data Transfer
            Addendum, which we include in our data processing agreement where
            they apply.
          </p>
        </section>

        {/* Marketing */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Marketing communications
          </h2>
          <p className="text-[#51617A] mb-3">
            We may send you information about Groovy Security products and
            services that we think you may find useful. You can opt out of
            marketing communications at any time by using the unsubscribe links
            in our emails or by contacting us directly.
          </p>
        </section>

        {/* Data protection rights */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Your data protection rights
          </h2>
          <p className="text-[#51617A] mb-2">
            We want to ensure that you are fully aware of your rights under
            applicable data protection laws (such as GDPR). Subject to certain
            conditions, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-[#51617A] space-y-1">
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
          <p className="text-[#51617A] mt-3">
            If you exercise these rights, we will respond as required by law,
            typically within one month. To make a request, please contact us
            using the details in the{" "}
            <span className="italic">How to contact us</span> section below.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Cookies and similar technologies
          </h2>
          <p className="text-[#51617A] mb-3">
            Cookies are small text files placed on your device that help us
            understand how you use our website and enable certain features (such
            as keeping you signed in). We may also use cookies or analytics to
            understand usage patterns and improve the site.
          </p>
          <p className="text-[#51617A] mb-3">
            Our website uses functional cookies and browser storage, for
            things like remembering a preference. It does not currently use
            advertising cookies or third-party analytics, and it loads its
            fonts from Google Fonts. If that changes, we will update this
            policy first.
          </p>
          <p className="text-[#51617A]">
            You can configure your browser to refuse cookies or to notify you
            when cookies are being set. Some features of the site may not work
            properly if cookies are disabled.
          </p>
        </section>

        {/* Children */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Children
          </h2>
          <p className="text-[#51617A]">
            Our website and services are made for businesses. We do not
            knowingly collect personal data from children. If you believe a
            child has given us personal data, please contact us and we will
            delete it.
          </p>
        </section>

        {/* Other sites */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Links to other websites
          </h2>
          <p className="text-[#51617A]">
            Our website may contain links to third-party websites. This Privacy
            Policy applies only to Groovy Security. If you follow a link to
            another website, we recommend that you read their privacy policy.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            Changes to this Privacy Policy
          </h2>
          <p className="text-[#51617A]">
            We keep this Privacy Policy under regular review and will post any
            updates on this page. The current version was last updated on{" "}
            <span className="font-medium">21 November 2026</span>.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            How to contact us
          </h2>
          <p className="text-[#51617A] mb-2">
            If you have any questions about this Privacy Policy, the data we
            hold about you, or if you wish to exercise your data protection
            rights, please contact us at:
          </p>
          <p className="text-[#51617A]">
            Email:{" "}
            <a
              href="mailto:support@groovysec.com"
              className="text-[#1A5FB4] underline hover:text-[#164F96]"
            >
              support@groovysec.com
            </a>
          </p>
        </section>

        {/* Authority */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1B2D] mb-2">
            How to contact the appropriate authority
          </h2>
          <p className="text-[#51617A]">
            If you wish to raise a concern or make a complaint about how we
            handle your personal data, you may contact the relevant data
            protection authority in your jurisdiction. If you are based in the
            United Kingdom or European Union, this may be your local data
            protection regulator or supervisory authority.
          </p>
        </section>

        <p className="text-[#6E7B8C] text-sm mt-12 pt-8 border-t border-[#0F1B2D]/10 text-center">
          Last updated: 21 November 2026
        </p>
      </div>
    </main>
    <Footer />
    </PageTransition>
  );
}