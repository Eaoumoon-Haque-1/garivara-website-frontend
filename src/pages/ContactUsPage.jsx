import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
} from "lucide-react";
import Button from "../components/shared/Button/Button";

const contactDetails = [
  {
    label: "Call us",
    value: "01712 456789",
    description: "Speak directly with our support team.",
    href: "tel:+8801712456789",
    Icon: Phone,
  },
  {
    label: "Email us",
    value: "info@garivara.com",
    description: "Send your questions at any time.",
    href: "mailto:info@garivara.com",
    Icon: Mail,
  },
  {
    label: "Visit us",
    value: "Dhaka, Bangladesh",
    description: "Find Gari Vara at our Dhaka location.",
    href: "#location",
    Icon: MapPin,
  },
];

function ContactCard({ detail }) {
  const { label, value, description, href, Icon } = detail;

  return (
    <a
      className="group flex min-w-0 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.4)] transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_22px_50px_-30px_rgba(15,23,42,0.32)] motion-reduce:transform-none"
      href={href}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
          {label}
        </span>
        <span className="mt-1 block break-words text-base font-bold text-slate-950">
          {value}
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">
          {description}
        </span>
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-slate-300 transition group-hover:text-emerald-700"
        aria-hidden="true"
      />
    </a>
  );
}

function FormField({ label, name, type = "text", placeholder, required }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-emerald-700">*</span>}
      </span>
      <input
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function ContactUsPage() {
  const sendEmail = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone") || "Not provided";
    const enquirySubject =
      formData.get("subject") || `Website enquiry from ${name}`;
    const message = formData.get("message");
    const subject = encodeURIComponent(enquirySubject);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:info@garivara.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="overflow-hidden bg-[#f7f9f7]">
      <section className="relative isolate bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-36 -top-48 size-[36rem] rounded-full bg-emerald-600/25 blur-3xl" />
          <div className="absolute -bottom-48 left-1/4 size-[30rem] rounded-full bg-emerald-900/70 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              <MessageSquareText className="size-4" aria-hidden="true" />
              Contact Gari Vara
            </p>
            <h1 className="mt-7 text-[clamp(2.7rem,8vw,5rem)] font-black leading-[1] tracking-[-0.055em]">
              Let&apos;s get your next
              <span className="block text-emerald-400">journey moving.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Have a booking question or need help planning a ride? Our team is ready to point you in the right direction.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-20 sm:-mt-10 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {contactDetails.map((detail) => (
              <ContactCard key={detail.label} detail={detail} />
            ))}
          </div>

          <div className="mt-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_80px_-42px_rgba(15,23,42,0.35)] lg:grid-cols-[0.7fr_1.3fr]">
            <div className="bg-emerald-800 p-6 text-white sm:p-9 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                Send a message
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
                Tell us how we can help
              </h2>
              <p className="mt-4 text-sm leading-6 text-emerald-100/80">
                Complete the form and your email application will open with the message ready to send.
              </p>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-start gap-3">
                  <Clock3
                    className="mt-0.5 size-5 shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">Support availability</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-100/75">
                      Contact us by phone for urgent booking assistance or email us for general enquiries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              className="grid gap-5 p-6 sm:grid-cols-2 sm:p-9 lg:p-10"
              onSubmit={sendEmail}
            >
              <FormField
                label="Your name"
                name="name"
                placeholder="Enter your full name"
                required
              />
              <FormField
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <FormField
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
              />
              <FormField
                label="Subject"
                name="subject"
                placeholder="How can we help?"
              />
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Message <span className="ml-1 text-emerald-700">*</span>
                </span>
                <textarea
                  className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                  name="message"
                  placeholder="Tell us about your question or journey..."
                  required
                />
              </label>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-slate-400">
                  This form uses your default email application to send the message.
                </p>
                <Button className="min-h-12 shrink-0 px-6" type="submit">
                  Send message
                  <Send className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="location" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Find us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Our location in Dhaka
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">
              Use the interactive map for directions to Gari Vara in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.4)]">
            <iframe
              className="h-[24rem] w-full sm:h-[30rem]"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1096.5819727453381!2d90.41840565740542!3d23.732284331511643!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2b7c7742512b03f3%3A0xeb3be6c9c02fca0b!2sGarivara%20%E2%80%93%20Rent%20A%20Car%20in%20Bangladesh!5e1!3m2!1sen!2sus!4v1783946614774!5m2!1sen!2sus"
              title="Gari Vara location in Dhaka"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUsPage;