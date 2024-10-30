import { toast } from "react-toastify";

export default function successToast(content: string) {
	toast(content, {
		type: "success",
	});
}
