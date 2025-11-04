import React from "react";

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-100">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

      <p className="text-slate-300 mb-4">
        Welcome to Groovy Security. By accessing or using our website and
        services (the “Service”), you agree to be bound by these Terms of
        Service. If you do not agree with these terms, you may not use the
        Service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Use of the Service</h2>
      <p className="text-slate-300 mb-4">
        You agree to use the Service only for lawful purposes and in accordance
        with these Terms. You may not attempt to interfere with, disrupt, or
        gain unauthorized access to any part of the Service, our systems, or
        customer data.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Accounts &amp; Security</h2>
      <p className="text-slate-300 mb-4">
        If an account is created, 
        you are responsible for maintaining the
        confidentiality of your login credentials and for all activity that
        occurs under your organization. You agree to notify us immediately of any
        unauthorized access or suspected breach of security.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Intellectual Property</h2>
      <p className="text-slate-300 mb-4">
        All content, trademarks, and materials available through the Service are
        the property of Groovy Security or our licensors. You may not copy,
        modify, or distribute any part of the Service without our prior written
        consent.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Disclaimer of Warranties</h2>
      <p className="text-slate-300 mb-4">
        The Service is provided on an “as is” and “as available” basis. Groovy
        Security disclaims all warranties of any kind, whether express or
        implied, including but not limited to implied warranties of
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
      <p className="text-slate-300 mb-4">
        To the fullest extent permitted by law, Groovy Security will not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages, or any loss of profits or data arising from your use of or
        inability to use the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Changes to These Terms</h2>
      <p className="text-slate-300 mb-4">
        We may update these Terms from time to time. When we do, we will revise
        the “Last updated” date at the bottom of this page. Your continued use
        of the Service after any changes become effective constitutes your
        acceptance of the updated Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p className="text-slate-300">
        If you have any questions about these Terms, you can contact us at{" "}
        <a
          href="mailto:support@groovysec.com"
          className="text-blue-400 underline"
        >
          support@groovysec.com
        </a>.
      </p>

      <p className="text-slate-500 text-sm mt-8">
        Last updated: November 2025
      </p>
    </main>
  );
}