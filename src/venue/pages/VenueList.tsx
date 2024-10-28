import { useEffect, useState } from "react";
import VenueService from "../../API/VenueService";
import { TVenue } from "../../types";
import { map } from "lodash-es";
import { useNavigate } from "react-router-dom";
import WithAuth from "../../hoc/WithAuth";
import "../styles/VenueList.scss";
import { Button, Card, Link as MaterialLink } from "@mui/material";
import {
	AddIcon,
	EditIcon,
	HomeIcon,
	InfoIcon,
	LinkIcon,
	PhoneIcon,
	RestaurantIcon,
	VisibilityIcon,
} from "../../icons";
import NoAuth from "../../hoc/NoAuth";

function VenueList() {
	const [venues, setVenues] = useState<Array<TVenue>>();
	const getVenues = async () => {
		const response = await VenueService.get();
		setVenues(response.items);
	};
	const navigate = useNavigate();

	useEffect(() => {
		getVenues();
	}, []);

	return (
		<div className="venue-list">
			<WithAuth>
				<Button
					variant="contained"
					className="add-venue"
					onClick={() => navigate("/venue/create")}
					endIcon={<AddIcon />}
				>
					ADD VENUE
				</Button>
			</WithAuth>
			<div className="cards">
				{map(venues, (venue) => {
					const { id, menuId } = venue;
					return (
						<Card key={id} className="venue-info">
							<VenueInfo venue={venue} />
							<Actions id={id!} menuId={menuId!} navigate={navigate} />
						</Card>
					);
				})}
			</div>
		</div>
	);
}

const Actions = ({
	id,
	menuId,
	navigate,
}: {
	id: string;
	menuId: string;
	navigate: Function;
}) => {
	return (
		<div className="actions">
			<WithAuth>
				<Button
					variant="contained"
					className="edit-venue"
					endIcon={<EditIcon />}
					onClick={() => navigate(`/venue/${id}`)}
				>
					EDIT VENUE
				</Button>
				{menuId ? (
					<>
						<Button
							variant="contained"
							className="edit-venue"
							onClick={() => navigate(`/menu/edit/${menuId}`)}
							endIcon={<EditIcon />}
						>
							EDIT MENU
						</Button>
						<Button
							variant="outlined"
							className="bg-white"
							onClick={() => navigate(`/menu/preview/${menuId}`)}
							endIcon={<VisibilityIcon />}
						>
							VIEW MENU
						</Button>
					</>
				) : (
					<Button
						variant="contained"
						className="edit-venue"
						onClick={() => navigate(`/menu/create`)}
						endIcon={<AddIcon />}
					>
						ADD MENU
					</Button>
				)}
			</WithAuth>

			{menuId && (
				<NoAuth>
					<Button
						variant="outlined"
						className="bg-white"
						onClick={() => navigate(`/menu/preview/${menuId}`)}
						endIcon={<VisibilityIcon />}
					>
						VIEW MENU
					</Button>
				</NoAuth>
			)}
		</div>
	);
};

const VenueInfo = ({ venue }: { venue: TVenue }) => {
	const { name, description, address, phoneNumber, websiteUrl } = venue;

	return (
		<>
			<h2>
				Venue Info &nbsp;
				<InfoIcon />
			</h2>
			<div className="info-section">
				<h3>
					Name &nbsp;
					<RestaurantIcon fontSize="small" />
				</h3>
				<p>{name}</p>
			</div>
			<div className="info-section">
				<h3>Description</h3>
				<p>{description}</p>
			</div>
			<div className="info-section">
				<h3>
					Address &nbsp;
					<HomeIcon fontSize="small" />
				</h3>
				<p>{address}</p>
			</div>
			<div className="info-section">
				<h3>
					Phone &nbsp;
					<PhoneIcon fontSize="small" />
				</h3>
				<p>{phoneNumber}</p>
			</div>
			<div className="info-section">
				<h3>
					Website &nbsp;
					<LinkIcon fontSize="small" />
				</h3>
				<p>
					<MaterialLink href={websiteUrl}>{websiteUrl}</MaterialLink>
				</p>
			</div>
		</>
	);
};

export default VenueList;
