-- Store every phone number in one format: +1 (604)-123-4567.
--
-- That is what the existing signup saves (PhoneInput formats "(604)-123-4567",
-- then formatPhoneWithAreaCode adds "+1 "), and what phoneNumberSchema now
-- outputs. Older rows were saved as "6041234567" or "604-123-4567", which also
-- breaks the organization signup's duplicate-phone check (it compares strings).
--
-- Only rows with exactly 10 digits (after dropping a leading country code 1)
-- are rewritten. Anything else, such as a 9 digit number, is left as it is.

update public.individual_profiles
set phone_num = regexp_replace(
  regexp_replace(regexp_replace(phone_num, '\D', '', 'g'), '^1(\d{10})$', '\1'),
  '^(\d{3})(\d{3})(\d{4})$',
  '+1 (\1)-\2-\3'
)
where regexp_replace(regexp_replace(phone_num, '\D', '', 'g'), '^1(\d{10})$', '\1') ~ '^\d{10}$'
  and phone_num !~ '^\+1 \(\d{3}\)-\d{3}-\d{4}$';

update public.organization_profiles
set phone_num = regexp_replace(
  regexp_replace(regexp_replace(phone_num, '\D', '', 'g'), '^1(\d{10})$', '\1'),
  '^(\d{3})(\d{3})(\d{4})$',
  '+1 (\1)-\2-\3'
)
where regexp_replace(regexp_replace(phone_num, '\D', '', 'g'), '^1(\d{10})$', '\1') ~ '^\d{10}$'
  and phone_num !~ '^\+1 \(\d{3}\)-\d{3}-\d{4}$';
