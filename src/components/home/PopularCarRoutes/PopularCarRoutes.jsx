import { CarFront } from "lucide-react";
import SectionHeading from "../../shared/SectionHeading/SectionHeading";

const popularCarRoutes = [
  "Dhaka to Cox's Bazar",
  "Chattogram to Bandarban",
  "Sylhet to Sreemangal",
  "Dhaka to Rajshahi",
  "Khulna to Bagerhat",
  "Dhaka to Mymensingh",
  "Cumilla to Chattogram",
  "Dhaka to Barishal",
  "Rajshahi to Bogura",
  "Dhaka to Narayanganj",
  "Sylhet to Sunamganj",
  "Dhaka to Gazipur",
  "Chattogram to Cox's Bazar",
  "Dhaka to Tangail",
  "Khulna to Jashore",
  "Dhaka to Pabna",
  "Rangpur to Dinajpur",
  "Dhaka to Manikganj",
  "Barishal to Patuakhali",
  "Dhaka to Feni",
  "Bogura to Naogaon",
  "Dhaka to Faridpur",
  "Cumilla to Noakhali",
  "Dhaka to Kishoreganj",
];

function shuffleRoutes(routes) {
  const shuffled = [...routes];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

const randomizedRoutes = shuffleRoutes(popularCarRoutes);

function PopularCarRoutes() {
  return (
    <section
      className="bg-slate-50 pb-12 sm:py-16 lg:py-20"
      aria-label="Popular car routes"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Popular car routes"
          description="Explore frequently booked car routes and start planning your next journey with Gari Vara."
        />

        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-y-5 lg:mt-12 lg:grid-cols-4">
          {randomizedRoutes.map((route) => (
            <li
              key={route}
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-emerald-800 hover:shadow-sm sm:text-base"
            >
              <CarFront
                className="size-5 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <span>{route}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PopularCarRoutes;