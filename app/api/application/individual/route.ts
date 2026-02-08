import { createClient } from "@/lib/supabase/server";
import { applicationSchemaIndividual } from "@/types/applicationSchema";
import { Database } from "@/types/database";

export async function POST(request: Request) {
    const body = await request.json();
    const parseResult = applicationSchemaIndividual.safeParse(body);
    if (!parseResult.success) {
        const result: Record<string, string> = {};
        for (const issue of parseResult.error.issues) {
            result[issue.path.join(".")] = issue.message;
        }

        return new Response(JSON.stringify({ status: "fail", data: result, }), { status: 400 });
    }


    // trim & insert into supabase (TODO)
    const trimmedBody = {
        approvalstatus: "to_review",
        paymentstatus: "pending",
       // full_name: parseResult.data.full_name.trim(),
        phoneNumber: parseResult.data.phone_number.trim(),
        phoneType: parseResult.data.phone_type,
        mailingAddress: parseResult.data.mailing_address.trim(),
        city: parseResult.data.city.trim(),
        country: parseResult.data.country.trim(),
        province: parseResult.data.province,
        postalCode: parseResult.data.postal_code.trim(),
        membershipinterest: parseResult.data.membership_interests,
        membershipreason: parseResult.data.reason.trim()
    };

    const supabase = await createClient();

    const { data, error: userError } = await supabase.from("users").select("id").eq("email", parseResult.data.email.trim()).single();
    if (userError) {
        return new Response(JSON.stringify({ status: "fail", data: userError.message }), { status: 500 });
    }

    // const { error } = await supabase.from("applications_individual").insert({...trimmedBody, userid: data.id});

    // if (error) {
    //     return new Response(JSON.stringify({ status: "fail", data: error.message }), { status: 500 });
    // }

    return new Response(JSON.stringify({ status: "success", data: null, }), { status: 200 });
}
