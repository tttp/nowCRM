"use client";
import { Input } from "../ui/input";

export function SearchTopBar() {
	// const router = useRouter();
	// const [isLoading, setIsLoading] = useState(false);
	// const [searchTerm, setSearchTerm] = useState<string>("");

	// const fetchData = async (search: string) => {
	// 	setIsLoading(true);
	// 	//here initial fetch
	// 	setIsLoading(false);
	// };

	// useEffect(() => {
	// 	if (searchTerm) {
	// 		fetchData(searchTerm);
	// 	}
	// }, [searchTerm, fetchData]);

	// const handleInputChange = (input: string) => {
	// 	setSearchTerm(input);
	// };

	return (
		<div className="p-5">
			<Input className="w-max" />
		</div>
	);
}
