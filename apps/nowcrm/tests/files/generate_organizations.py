import csv
import random
import sys
from faker import Faker

fake = Faker()

if len(sys.argv) < 3:
    print("Usage: python generate_organizations.py <output_file> <count>")
    sys.exit(1)

output_file = sys.argv[1]
num_organizations = int(sys.argv[2])

available_fields = [
    "email", "name", "address_line1", "contact_person", "location", "frequency", "media_type", "zip", "country", "url",
    "organization_type", "twitter_url", "facebook_url", "whatsapp_channel", "linkedin_url", "telegram_url",
    "telegram_channel", "instagram_url", "tiktok_url", "whatsapp_phone", "phone", "tag", "description", "canton",
    "language", "locale", "status", "sources", "industry"
]

frequencies = ["Daily", "Weekly", "Monthly", "Yearly"]
media_types = ["Online", "Print", "TV", "Radio"]
organization_types = ["Non-profit", "Company", "Government", "Startup"]
countries = ["Switzerland", "Germany", "France", "Italy"]
languages = ["English", "German", "French", "Italian"]
cantons = ["ZH", "GE", "VD", "BE", "TI"]
locales = ["en_CH", "de_CH", "fr_CH", "it_CH"]
statuses = ["new", "existed"]
sources = ["Website", "Referral", "Event", "Social Media"]
industries = ["Finance", "Healthcare", "Education", "Technology", "Retail"]

with open(output_file, mode="w", newline='', encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(available_fields)

    for i in range(num_organizations):
        email = fake.unique.email()
        name = fake.company()
        address_line1 = fake.street_address()
        contact_person = fake.name()
        location = fake.city()
        frequency = random.choice(frequencies)
        media_type = random.choice(media_types)
        zip_code = f"{random.randint(1000, 9999)}"
        country = random.choice(countries)
        url = fake.url()
        organization_type = random.choice(organization_types)
        twitter_url = f"https://twitter.com/{fake.user_name()}{i}"
        facebook_url = f"https://facebook.com/{fake.user_name()}{i}"
        whatsapp_channel = f"+41{random.randint(100000000, 999999999)}"
        linkedin_url = f"https://linkedin.com/company/{i}-{fake.company_suffix()}"
        telegram_url = f"https://t.me/{fake.user_name()}{i}"
        telegram_channel = f"https://t.me/{fake.user_name()}{i}_channel"
        instagram_url = f"https://instagram.com/{fake.user_name()}{i}"
        tiktok_url = f"https://tiktok.com/@{fake.user_name()}{i}"
        whatsapp_phone = f"+41{random.randint(100000000, 999999999)}"
        phone = f"+41{random.randint(100000000, 999999999)}"
        tag = f"Tag_{i}"
        description = f"Organization {name} ({i}) in {random.choice(industries)}"
        canton = random.choice(cantons)
        language = random.choice(languages)
        locale = random.choice(locales)
        status = random.choice(statuses)
        sources_val = random.choice(sources)
        industry = random.choice(industries)

        row = [
            email, name, address_line1, contact_person, location, frequency, media_type, zip_code, country, url,
            organization_type, twitter_url, facebook_url, whatsapp_channel, linkedin_url, telegram_url,
            telegram_channel, instagram_url, tiktok_url, whatsapp_phone, phone, tag, description, canton,
            language, locale, status, sources_val, industry
        ]
        writer.writerow(row)

print(f"Done: '{output_file}' generated with {num_organizations} unique organizations.")
