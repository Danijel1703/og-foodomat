import { find, flatMap, isEmpty, map } from "lodash-es";
import { MouseEventHandler, useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { OrderService, UserService, VenueService } from "../../API";
import { orderStatuses } from "../../constants";
import { TOrder, TVenue, TVenueVote } from "../../types";
import { generateId, getAuth } from "../../utils";
import Select from "react-select";
import chroma from "chroma-js";
import { Button, setRef } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

const color = chroma("#4caf50");

function VenueSelect({
	order,
	update,
}: {
	order: TOrder;
	update: (order: TOrder, stateOnly?: boolean) => void;
}) {
	const [venues, setVenues] = useState<Array<TVenue & { isSelected: boolean }>>(
		[]
	);
	const [alreadyVoted, setAlreadyVoted] = useState(false);
	const [selectedVenue, setSelectedVenue] = useState<TVenue>();
	const [refKey, setRefKey] = useState(generateId());
	const userId = getAuth().currentUser?.uid;
	const isOrderAdmin = userId === order.orderAdminId;

	const getVenues = async () => {
		const response = await VenueService.get();
		setVenues(
			map(response.items, (i) => ({
				...i,
				value: i.name,
				label: i.name,
				isSelected: false,
			}))
		);
	};

	const selectItem = (value: SingleValue<any>) => {
		setVenues((oldItems) =>
			map(oldItems, (i) => ({ ...i, isSelected: i.id === value?.id }))
		);
	};

	useEffect(() => {
		getVenues();
		OrderService.attachListener(
			"venueVotes",
			order.id!,
			(venueVotes: Array<TVenueVote>) => {
				order.venueVotes = venueVotes;
				update(order, true);
			}
		);
	}, []);

	useEffect(() => {
		setSelectedVenue(find(venues, (venue) => venue.isSelected));
	}, [venues]);

	useEffect(() => {
		if (order.venueVotes) {
			const userIds = map(
				flatMap(order.venueVotes, (v) => v.users),
				(u) => u.id
			);
			setAlreadyVoted(userIds.includes(userId));
		}
	}, [order]);

	const updateOrderVenue: MouseEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();
		order.status = orderStatuses.mealSelect;
		order.venueId = selectedVenue?.id;
		update(order);
	};

	const submitVote = async () => {
		const user = await UserService.getById(userId!);
		if (!selectedVenue) return;
		const newVote = {
			venueId: selectedVenue.id as string,
			venueName: selectedVenue.name,
			users: [user],
		};
		if (!order.venueVotes) {
			order.venueVotes = [newVote];
		} else {
			const venue = find(
				order.venueVotes,
				(v) => v.venueId === selectedVenue.id
			);
			if (venue) {
				venue.users.push(user);
			} else {
				order.venueVotes.push(newVote);
			}
		}
		update(order);
		if (isOrderAdmin) {
			setSelectedVenue(undefined);
			setRefKey(generateId());
		}
	};

	return (
		<div className="step-content">
			{isOrderAdmin ? <h1>Select venue</h1> : <h1>Vote for venue</h1>}
			<Select
				options={venues}
				key={refKey}
				placeholder="Select venue..."
				styles={{
					control: (base) => ({
						...base,
						"&:hover": { borderColor: "gray" },
						border: "1px solid lightgray",
						boxShadow: "none",
					}),
					option: (base, { data, isDisabled, isFocused, isSelected }) => ({
						...base,
						backgroundColor: isDisabled
							? undefined
							: isSelected
							? "#4caf50"
							: isFocused
							? color.alpha(0.1).css()
							: undefined,
						":active": {
							...base[":active"],
							backgroundColor: !isDisabled
								? isSelected
									? data.color
									: color.alpha(0.3).css()
								: undefined,
						},
					}),
				}}
				onChange={selectItem}
			/>
			{order.venueVotes && <BarChart venueVotes={order.venueVotes} />}
			<div className="step-actions">
				{!alreadyVoted && !isOrderAdmin && (
					<Button
						variant="contained"
						onClick={submitVote}
						disabled={isEmpty(selectedVenue)}
						endIcon={<CheckCircleOutlineIcon />}
					>
						Vote
					</Button>
				)}
				{isOrderAdmin && (
					<Button onClick={updateOrderVenue} disabled={isEmpty(selectedVenue)}>
						Next
					</Button>
				)}
			</div>
		</div>
	);
}

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const BarChart = ({ venueVotes }: { venueVotes: Array<TVenueVote> }) => {
	const venues = map(venueVotes, (venue) => venue.venueName);
	const votes = map(venueVotes, (venue) => venue.users.length);

	const data = {
		labels: venues,
		datasets: [
			{
				label: "Number of Votes",
				data: votes,
				backgroundColor: "rgba(79, 175, 76, 0.6)",
				borderColor: "rgba(79, 175, 76, 1)",
				borderWidth: 1,
				barThickness: 30,
			},
		],
	};

	const options = {
		indexAxis: "y",
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
			title: {
				display: true,
				text: "Votes per Venue",
			},
		},
		scales: {
			x: {
				beginAtZero: true,
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: true,
				},
			},
		},
	};

	return (
		<div className="venue-votes">
			<Bar data={data} options={options} style={{ maxHeight: 400 }} />
		</div>
	);
};

export default VenueSelect;
