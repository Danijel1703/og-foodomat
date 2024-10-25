import { useEffect, useState } from "react";
import VenueService from "../../API/VenueService";
import { TVenue } from "../../types";
import { map } from "lodash-es";
import { Link } from "react-router-dom";
import WithAuth from "../../hoc/WithAuth";

function VenueList() {
	const [venues, setVenues] = useState<Array<TVenue>>();
	const getVenues = async () => {
		const response = await VenueService.get();
		setVenues(response.items);
	};

	useEffect(() => {
		getVenues();
	}, []);

	return (
		<div>
			<WithAuth>
				<Link to={"/venue/create"}>Add Venue</Link>
			</WithAuth>
			{map(venues, (venue) => {
				const {
					id,
					name,
					description,
					address,
					phoneNumber,
					websiteUrl,
					menuId,
				} = venue;
				return (
					<div key={id}>
						<div>{name}</div>
						<div>{description}</div>
						<div>{address}</div>
						<div>{phoneNumber}</div>
						<div>{websiteUrl}</div>
						<WithAuth>
							<Link to={`/venue/${id}`}>Edit Venue</Link>
						</WithAuth>
						<WithAuth>
							{menuId ? (
								<Link to={`/menu/preview/${menuId}`}>View Menu</Link>
							) : (
								<Link to={`/menu/create`}>Add Menu</Link>
							)}
						</WithAuth>
					</div>
				);
			})}
		</div>
	);
}

export default VenueList;
