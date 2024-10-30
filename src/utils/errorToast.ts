import { toast } from "react-toastify";

export default function errorToast(content: string) {
	toast(content, {
		type: "error",
	});
}
