import csv
import random
import sys
from faker import Faker

fake = Faker()

if len(sys.argv) < 3:
    print("Usage: python generate_contacts.py <output_file> <count>")
    sys.exit(1)

output_file = sys.argv[1]
num_contacts = int(sys.argv[2])

required_fields = [
    "email", "first_name", "last_name", "address_line1", "address_line2", "zip",
    "location", "canton", "country", "language", "function", "phone",
    "mobile_phone", "salutation", "gender", "website_url", "linkedin_url",
    "facebook_url", "twitter_url", "birth_date", "organization", "department",
    "description", "contact_interests", "priority", "status", "tag", "keywords",
    "last_access", "account_created_at", "ranks", "contact_types", "sources",
    "notes", "industry"
]

priorities = ["p1", "p2", "p3", "p4", "p5"]
salutations = ["Mr.", "Ms.", "Mrs.", "Dr."]
genders = ["Male", "Female", "Other"]
languages = ["English", "German", "French", "Italian"]
statuses = ["new", "closed", "contacted", "negotiating", "registered", "backfill","customer/no marketing","prospect/marketing"]
tags = ["Lead", "Customer", "Prospect"]
ranks = ["Gold", "Silver", "Bronze"]
contact_types = ["Primary Contact", "Secondary Contact"]
sources = ["Website Form", "Referral", "Event"]

with open(output_file, mode="w", newline='', encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(required_fields)

    for i in range(num_contacts):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"{first_name.lower()}.{last_name.lower()}.{i}@example.com"
        address_line1 = fake.street_address()
        address_line2 = f"Apt {i % 100 + 1}"
        zip_code = f"{random.randint(10000, 99999)}"
        location = fake.city()
        canton = fake.state_abbr()
        country = "Switzerland"
        language = random.choice(languages)
        function = fake.job()
        phone = f"+41{random.randint(100000000, 999999999)}"
        mobile_phone = f"+41{random.randint(100000000, 999999999)}"
        salutation = random.choice(salutations)
        gender = random.choice(genders)
        website_url = f"https://{first_name.lower()}{last_name.lower()}{i}.com"
        linkedin_url = f"https://linkedin.com/in/{first_name.lower()}{last_name.lower()}{i}"
        facebook_url = f"https://facebook.com/{first_name.lower()}{last_name.lower()}{i}"
        twitter_url = f"https://twitter.com/{first_name.lower()}{last_name.lower()}{i}"
        birth_date = fake.date_of_birth(minimum_age=18, maximum_age=70).strftime("%Y-%m-%d")
        organization = f"{fake.company()} {i}"
        department = f"{fake.bs().title()} {i}"
        description = f"Test contact {first_name} {last_name} ({i})"
        contact_interests = f"{fake.word()}_{i}"
        priority = random.choice(priorities)
        status = random.choice(statuses)
        tag = f"{random.choice(tags)}_{i}"
        keywords = f"{first_name},{last_name},test,{i}"
        last_access = f"2024-07-07T12:{i//60%60:02d}:{i%60:02d}"
        account_created_at = f"2023-01-01T08:{i//60%60:02d}:{i%60:02d}"
        ranks_val = f"{random.choice(ranks)}_{i}"
        contact_types_val = f"{random.choice(contact_types)}_{i}"
        sources_val = f"{random.choice(sources)}_{i}"
        notes = f"Generated for testing ({i})"
        industry = f"{fake.word().capitalize()}_{i}"

        row = [
            email, first_name, last_name, address_line1, address_line2, zip_code,
            location, canton, country, language, function, phone, mobile_phone,
            salutation, gender, website_url, linkedin_url, facebook_url, twitter_url,
            birth_date, organization, department, description, contact_interests,
            priority, status, tag, keywords, last_access, account_created_at,
            ranks_val, contact_types_val, sources_val, notes, industry
        ]
        writer.writerow(row)

print(f"Done: '{output_file}' generated with {num_contacts} unique contacts.")
