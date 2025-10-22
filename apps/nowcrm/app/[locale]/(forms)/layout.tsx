// contactsapp/app/[locale]/(forms)/layout.tsx

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-white dark:bg-[#000000]">
			{children}
		</div>
	);
}
