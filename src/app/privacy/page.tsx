import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "FASHION Privacy Policy — how we collect, use, and protect your personal information.",
};

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact us for support. This includes:

— **Personal Identification Information**: Name, email address, phone number, and delivery address.
— **Payment Information**: Billing details processed securely via our payment partners (Stripe). We do not store your full card details on our servers.
— **Order History**: Products purchased, sizes, quantities, and transaction amounts.
— **Communications**: Any messages or feedback you send us.

We also automatically collect certain information when you visit our website, including IP address, browser type, device identifiers, pages visited, and time spent on pages (via standard analytics tools).`,
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: `We use the information collected to:

— Process and fulfil your orders, including sending confirmation and shipping notifications
— Set up and manage your FASHION account
— Send marketing communications (only with your explicit consent)
— Improve our website, products, and customer service
— Detect and prevent fraudulent transactions
— Comply with legal obligations under the Information Technology Act, 2000 and related rules (India) and the General Data Protection Regulation (GDPR) where applicable`,
  },
  {
    id: "sharing-your-information",
    title: "3. Sharing Your Information",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:

— **Service Providers**: Logistics partners (Delhivery, Blue Dart) for order fulfilment; payment processors (Stripe) for transaction processing; email service providers for communications.
— **Legal Compliance**: When required by law, court order, or governmental authority.
— **Business Transfers**: In connection with any merger, acquisition, or sale of company assets, with appropriate notice to you.

All third-party service providers are contractually bound to maintain the confidentiality of your data.`,
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking",
    content: `We use cookies and similar tracking technologies to:

— Keep you logged into your account across sessions
— Remember your preferences and cart contents
— Analyse website traffic and usage patterns
— Serve relevant advertising (only if you consent)

You can control cookies through your browser settings. Declining non-essential cookies will not affect your ability to shop on our site. For more information, see our Cookie Policy accessible via the consent banner.`,
  },
  {
    id: "data-security",
    title: "5. Data Security",
    content: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse. Our website uses SSL/TLS encryption for all data transmission. Payment processing is handled by PCI-DSS compliant processors.

Despite our best efforts, no internet transmission is completely secure. We encourage you to use strong passwords and log out of your account after each session.`,
  },
  {
    id: "your-rights",
    title: "6. Your Rights (GDPR & Indian IT Act)",
    content: `Under applicable data protection laws, you have the right to:

— **Access**: Request a copy of the personal data we hold about you.
— **Rectification**: Request correction of inaccurate data.
— **Erasure**: Request deletion of your personal data ("right to be forgotten"), subject to legal obligations.
— **Portability**: Request your data in a machine-readable format.
— **Objection**: Object to processing of your data for marketing purposes.
— **Withdrawal of Consent**: Withdraw consent at any time without affecting prior lawful processing.

To exercise any of these rights, contact us at privacy@fashion.in. We will respond within 30 days.`,
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: `We retain your personal data for as long as necessary to fulfil the purposes described in this policy, comply with our legal obligations, resolve disputes, and enforce our agreements. Order data is typically retained for 7 years for accounting and tax compliance. You may request deletion of your account data at any time.`,
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    content: `Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us and we will promptly delete it.`,
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. The date of the last update is shown at the bottom of this page. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: `If you have questions, concerns, or complaints about this policy or our data practices, please contact our Data Protection Officer:

**FASHION Pvt. Ltd.**
Email: privacy@fashion.in
Phone: +91 98765 00000
Address: 404, Commerce Centre, Mumbai, Maharashtra 400001, India

For EU/UK residents, you may also lodge a complaint with your local supervisory authority.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-beige-200">
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-3">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-charcoal-500">
          Last updated: 1 April 2025 &nbsp;·&nbsp; Effective from: 1 January 2025
        </p>
        <p className="text-sm text-charcoal-500 mt-3 max-w-2xl leading-relaxed">
          At FASHION, your privacy is fundamental to how we operate. This policy explains what data
          we collect, why we collect it, and how we protect it. Please read it carefully.
        </p>
      </div>

      <div className="flex gap-12">
        {/* TOC — sticky desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-xs uppercase tracking-widest font-medium text-charcoal mb-4">Contents</p>
            <nav className="space-y-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-charcoal-500 hover:text-sienna transition-colors py-0.5"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-sm max-w-none text-charcoal-500 leading-relaxed">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-3 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-beige-200 flex flex-col sm:flex-row gap-4 justify-between items-start text-xs text-charcoal-500">
            <p>© {new Date().getFullYear()} FASHION Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-sienna transition-colors">About Us</Link>
              <a href="mailto:privacy@fashion.in" className="hover:text-sienna transition-colors">privacy@fashion.in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
