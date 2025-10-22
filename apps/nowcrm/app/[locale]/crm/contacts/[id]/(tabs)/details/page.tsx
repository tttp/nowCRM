import ErrorMessage from "@/components/ErrorMessage";
import contactsService from "@/lib/services/new_type/contacts.service";
import { AddressCard } from "./components/addressInfo/AddressInfoCard";
import { PersonalInfoCard } from "./components/personalInfo/personalInfocard";
import { ProfessionalInfoCard } from "./components/professionalInfo/professionalInforCard";

export default async function Home(props: { params: Promise<{ id: number }> }) {
	const params = await props.params;
	const contact = await contactsService.findOne(params.id, {
		populate: "*",
	});

	if (!contact.data || !contact.success) {
		return <ErrorMessage response={contact} />;
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			<PersonalInfoCard contact={contact.data} />
			<AddressCard contact={contact.data} />
			<ProfessionalInfoCard contact={contact.data} />
		</div>
	);
}
