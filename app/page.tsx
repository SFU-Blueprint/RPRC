
import { inter, headerStyles, subheaderStyles, bodyStyles, buttonStyles } from "@/app/fonts";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HomePageForm } from "@/components/homepage/HomePageForm";
import { getUser, hasApplication } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default async function HomePage() {
  // Check if user is already logged in
  const user = await getUser();

  if (user) {
    // User is logged in, check for application
    const userHasApplication = await hasApplication(user.id);

    if (userHasApplication) {
      // Has application - redirect to dashboard
      redirect(ROUTES.MEMBERSHIP_DASHBOARD);
    }

    // No application - redirect to form
    redirect(ROUTES.MEMBERSHIP_FORM);
  }

  return (
    <div className="min-h-screen relative">
      <Image
        src="/homepage/hero-background.png"
        alt="Hero background"
        fill={true}
        priority
      />
      <div className="relative py-8 md:py-12 lg:py-16">
        <div className="bg-none max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
          <h1 className={`text-left ${headerStyles.mResponsive} text-gray-900`}>
            Join the RPRC commnunity
          </h1>
          <h1 className={`${headerStyles.s} pt-4`}>Be part of the making a difference</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative bg-none max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          <div className="bg-background-off-white rounded-3xl p-8 md:p-10 lg:p-12 h-fit">
            <h2 className={`${subheaderStyles.m} mb-6 text-gray-900`}>
              Interested in becoming a member?
            </h2>

            <div className="text-gray-800">
              <p className={`${bodyStyles.s} leading-relaxed`}>
                Create an account and join the Richmond Poverty Reduction Coalition to vote at our Annual General Meeting, and be the first to receive news, advocacy updates, event invitations, and project involvement opportunities.
              </p>
              <p className={`${bodyStyles.s} leading-relaxed`}>
                After account creation you will need to fill out an application form.
              </p>
            </div>
            <Link className="mx-auto block pt-4 w-fit" href={ROUTES.MEMBERSHIP_SIGNUP}>
              <Button size="sm" className="text-xs cursor-pointer">Sign Up</Button>
            </Link>
          </div>

          {/* Right: Sign In Form */}
          <div className="space-y-8">
            <HomePageForm />
          </div>
        </div>
      </div>
    </div>
  );
}
