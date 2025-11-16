import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Keyboard } from "lucide-react";

const LegalPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPage = () => {
    return location.pathname === "/privacy" ? "privacy" : "terms";
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  useEffect(() => {
    const page = location.pathname === "/privacy" ? "privacy" : "terms";
    setCurrentPage(page);
  }, [location.pathname]);

  const termsContent = {
    title: "Terms of Service",
    lastUpdated: "November 15, 2025",
    sections: [
      {
        title: "Agreement",
        content:
          "By accessing Lazytype, you agree to be bound by these Terms of Service and agree that you are responsible for compliance with any applicable local laws. If you do not agree to all the terms and conditions, you are not permitted to use our services.",
      },
      {
        title: "Account Security & Limitations",
        content:
          "You are responsible for your account's security and all activities on your account. You must not violate any applicable laws or misuse this site.",
        subsections: [
          {
            content:
              "Lazytype reserves the right to remove or disable any account or content at any time for any reason, without prior notice, if we believe you have violated this agreement.",
          },
          {
            subtitle:
              "You agree that you will not upload, post, or transmit content that:",
            points: [
              "is unlawful or promotes unlawful activities",
              "is sexually obscene, libelous, defamatory, or fraudulent",
              "is discriminatory or abusive toward any individual or group",
              "represents hate speech, incites violence, or contains graphic violence",
              "violates any person's right to privacy or collects personal information without consent",
              "contains malware or infringes on any proprietary rights",
            ],
          },
          {
            subtitle: "While using the Services, you agree that you will not:",
            points: [
              "harass, abuse, threaten, or incite violence towards any individual or group",
              "use our servers for spamming or excessive automated bulk activity",
              "attempt to disrupt or tamper with our servers",
              "falsely impersonate any person or entity",
              "cheat or manipulate test results using automated tools or scripts",
              "create multiple accounts to manipulate leaderboards",
              "violate the privacy of any third party",
            ],
          },
        ],
      },
      {
        title: "Privacy Policy",
        content:
          "If you use our Services, you must abide by our Privacy Policy. You acknowledge that you have read our Privacy Policy and understand that it sets forth how we collect, use, and store your information. If you do not agree with our Privacy Policy, you must stop using the Services immediately.",
      },
      {
        title: "Limitations on Automated Use",
        content: "While accessing or using the Services, you may not:",
        points: [
          "use bots, hacks, or cheats while using our site",
          "create automated requests to our servers",
          "tamper with or use non-public areas of the Services",
          "probe, scan, or test any system or network for vulnerabilities",
          "scrape content or use automated means to download data",
          "employ misleading identifiers or forge headers",
          "interfere with or disrupt the access of any user or network",
        ],
      },
      {
        title: "User Data & Leaderboards",
        content:
          "By using Lazytype, you understand that your username and best typing scores will be displayed publicly on leaderboards. Your profile is publicly accessible to other users. You may delete your account at any time, which will permanently remove all your data and leaderboard entries.",
      },
      {
        title: "Third-Party Services",
        content:
          "Our Service uses Vercel (frontend hosting), Firebase (authentication), Railway (backend hosting), and Google OAuth (optional login). These services have their own terms and privacy policies. Lazytype is not responsible for the contents of any linked sites.",
      },
      {
        title: "Changes to Terms",
        content:
          "Lazytype may revise these Terms of Service at any time without prior notice. By using this Website, you agree to be bound by the current version of these Terms of Service.",
      },
      {
        title: "Disclaimer",
        content:
          "We only offer our Services on an 'AS-IS' basis. Your access to and use of the Services is at your own risk. You understand and agree that the Services are provided to you on an 'AS IS' and 'AS AVAILABLE' basis. To the full extent permitted by law, Lazytype disclaims all warranties, express or implied, including without limitation warranties of merchantability, fitness for a particular purpose, or non-infringement. Lazytype makes no representations or warranties that the Services will be timely, uninterrupted, error-free, or free of viruses or other harmful components. Our total liability shall not exceed the amount you paid to use the Service (which is zero, as the Service is free).",
      },
      {
        title: "Governing Law",
        content:
          "These Terms are governed by the laws of Indonesia. Any disputes shall be resolved in the courts of Surabaya, Indonesia.",
      },
      {
        title: "Contact",
        content:
          "If you have any questions about these Terms of Service, please contact us at: abroorhilmi@gmail.com",
      },
    ],
  };

  const privacyContent = {
    title: "Privacy Policy",
    lastUpdated: "November 15, 2025",
    sections: [
      {
        title: "Introduction",
        content:
          "This Privacy Policy explains how we collect, use, store, and protect your personal information when you use Lazytype. We are committed to protecting your privacy and being transparent about our data practices.",
      },
      {
        title: "Information We Collect",
        subsections: [
          {
            subtitle: "Account Information",
            points: [
              "Username (publicly displayed)",
              "Email address (for account management)",
              "Password (stored in hashed format - we never see your actual password)",
            ],
          },
          {
            subtitle: "Typing Test Data",
            points: [
              "Words per minute (WPM), accuracy, raw WPM",
              "Test history, timestamps, and completion status",
              "Total time spent typing",
              "How many typing test you've started and completed",
              "Average WPM and best scores by language/test type",
              "Overall statistics and progress metrics",
            ],
          },
          {
            subtitle: "Technical Information",
            points: [
              "IP address (for security and analytics)",
              "Browser type, version, and operating system",
              "Device information",
              "Cookies and local storage data",
            ],
          },
        ],
      },
      {
        title: "How We Use Your Information",
        content: "Your data is used to:",
        points: [
          "Authenticate your account and maintain login sessions",
          "Display your typing statistics and track your progress",
          "Show your username and best scores on public leaderboards",
          "Analyze usage patterns to improve the Service",
          "Detect and prevent fraudulent activity or cheating",
          "Protect against unauthorized access",
        ],
      },
      {
        title: "Public Information",
        content: "The following information is publicly visible to all users:",
        points: [
          "Your username",
          "Your best typing scores (by language and test type)",
          "Your leaderboard rankings",
          "Your public profile statistics",
        ],
      },
      {
        title: "Third-Party Services",
        content: "We use the following services that may access your data:",
        points: [
          "Vercel (Frontend Hosting) - Hosts the website interface",
          "Firebase (Authentication) - Manages user authentication and OAuth",
          "Railway (Backend Hosting) - Hosts our servers and database",
          "Google (OAuth Provider) - If you sign in with Google",
        ],
        subsections: [
          {
            subtitle: "What We DON'T Do",
            points: [
              "We do NOT sell your personal information",
              "We do NOT share your email with third parties for marketing",
              "We do NOT display advertisements",
              "We do NOT use your data for purposes outside this policy",
            ],
          },
        ],
      },
      {
        title: "Data Security",
        content: "We implement security measures including:",
        points: [
          "Passwords are hashed and never stored in plain text",
          "Secure HTTPS connections for all data transmission",
          "Regular security updates and monitoring",
          "Access controls to protect your data",
        ],
      },
      {
        title: "Data Retention",
        points: [
          "Active accounts: Data is retained while your account is active",
          "Deleted accounts: Data is permanently deleted upon account deletion",
          "Backups: May be retained for up to 30 days for system recovery",
        ],
      },
      {
        title: "Your Rights",
        content: "You can:",
        points: [
          "View your data through your account dashboard and profile",
          "Update your username, email address, and password",
          "Delete your account at any time (this permanently removes all your data and cannot be undone)",
        ],
      },
      {
        title: "Children's Privacy",
        content:
          "The Service is not intended for children under 13 years of age. We do not knowingly collect information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us.",
      },
      {
        title: "International Users",
        content:
          "Our servers are located in various regions through our hosting providers. If you access the Service from outside Indonesia, your information may be transferred to and processed in different countries. By using the Service, you consent to such transfers.",
      },
      {
        title: "Changes to Privacy Policy",
        content:
          "We may update this Privacy Policy from time to time. We will notify you by posting the updated policy on the Service and updating the 'Last Updated' date. Your continued use after changes constitutes acceptance of the updated policy.",
      },
      {
        title: "Contact",
        content:
          "If you have questions about this Privacy Policy or our data practices, please contact us at:",
        subsections: [
          {
            content: "Email: abroorhilmi@gmail.com",
          },
        ],
      },
    ],
  };

  const content = currentPage === "terms" ? termsContent : privacyContent;

  return (
    <div className="flex flex-col min-h-screen bg-[#282828] antialiased">
      {/* navbar */}
      <nav className="content-grid z-20 top-0 left-0 py-2">
        <div className="py-3 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition"
          >
            <Keyboard className="w-10 h-15 text-[#D8AB19]" />
            <span className="font-semibold text-3xl hidden sm:inline custom-hide-text text-[#D6C7A3]">
              lazytype
            </span>
          </Link>
          <div className="flex items-center space-x-3 text-[#ebdbb2] flex-wrap gap-2">
            <button
              onClick={() => navigate("/terms")}
              className={`px-3 sm:px-4 py-2 rounded transition-colors cursor-pointer text-sm sm:text-base ${currentPage === "terms"
                  ? "text-[#b8bb26]"
                  : "text-[#a89984] hover:text-[#ebdbb2]"
                }`}
            >
              <span className="hidden sm:inline">Terms of Service</span>
              <span className="sm:hidden">Terms</span>
            </button>
            <button
              onClick={() => navigate("/privacy")}
              className={`px-3 sm:px-4 py-2 rounded transition-colors cursor-pointer text-sm sm:text-base ${currentPage === "privacy"
                  ? "text-[#b8bb26]"
                  : "text-[#a89984] hover:text-[#ebdbb2]"
                }`}
            >
              <span className="hidden sm:inline">Privacy Policy</span>
              <span className="sm:hidden">Privacy</span>
            </button>
          </div>
        </div>
      </nav>

      {/* content */}
      <main className="flex-grow content-grid">
        <div className="py-8 sm:py-12">
          {/* header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#fabd2f] mb-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-[#a89984]">
              Last Updated: {content.lastUpdated}
            </p>
          </div>

          {/* sections */}
          <div className="space-y-8 sm:space-y-10">
            {content.sections.map((section, idx) => (
              <section key={idx} className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#83a598]">
                  {section.title}
                </h2>

                {section.content && (
                  <p className="text-sm sm:text-base text-[#ebdbb2] leading-relaxed">
                    {section.content}
                  </p>
                )}

                {section.points && (
                  <ul className="space-y-2 ml-4 sm:ml-6">
                    {section.points.map((point, pointIdx) => (
                      <li
                        key={pointIdx}
                        className="text-sm sm:text-base text-[#ebdbb2] leading-relaxed"
                      >
                        <span className="text-[#fe8019] mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="space-y-4 sm:space-y-6 ml-2 sm:ml-4">
                    {section.subsections.map((sub, subIdx) => (
                      <div key={subIdx} className="space-y-2 sm:space-y-3">
                        {sub.subtitle && (
                          <h3 className="text-lg sm:text-xl font-medium text-[#d3869b]">
                            {sub.subtitle}
                          </h3>
                        )}

                        {sub.content && (
                          <p className="text-sm sm:text-base text-[#ebdbb2] leading-relaxed">
                            {sub.content}
                          </p>
                        )}

                        {sub.points && (
                          <ul className="space-y-2 ml-4 sm:ml-6">
                            {sub.points.map((point, pointIdx) => (
                              <li
                                key={pointIdx}
                                className="text-sm sm:text-base text-[#ebdbb2] leading-relaxed"
                              >
                                <span className="text-[#fe8019] mr-2">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* footer */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[#504945]">
            <p className="text-sm sm:text-base text-[#a89984] text-center leading-relaxed">
              By using this Service, you acknowledge that you have read,
              understood, and agree to be bound by these{" "}
              {currentPage === "terms" ? "Terms of Service" : "policies"}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LegalPages;
