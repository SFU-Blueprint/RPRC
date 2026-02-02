import { createClient } from "@/lib/supabase/server";
import { applicationSchema } from "@/types/applicationSchema";

export async function POST(request: Request) {
    const body = await request.json();
    const parseResult = applicationSchema.safeParse(body);
    if (!parseResult.success) {
        const result: Record<string, string> = {};
        for (const issue of parseResult.error.issues) {
            result[issue.path.join(".")] = issue.message;
        }

        return new Response(JSON.stringify({ status: "fail", data: result, }), { status: 400 });
    }

    // trim & insert into supabase (TODO)
    const trimmedBody = {
        full_name: parseResult.data.full_name.trim(),
        email: parseResult.data.email.trim(),
        phone_number: parseResult.data.phone_number.trim(),
        phone_type: parseResult.data.phone_type,
        mailing_address: parseResult.data.mailing_address.trim(),
        city: parseResult.data.city.trim(),
        province: parseResult.data.province,
        postal_code: parseResult.data.postal_code.trim(),
        membership_interests: parseResult.data.membership_interests,
        reason: parseResult.data.reason.trim()
    };

    const supabase = createClient();
    // const { error } = await supabase.from("applications_individual").insert(trimmedBody);

    return new Response(JSON.stringify({ status: "success", data: null, }), { status: 200 });
}
