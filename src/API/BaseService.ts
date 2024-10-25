import { initializeApp } from "firebase/app";
import {
	Database,
	get,
	getDatabase,
	limitToFirst,
	orderByChild,
	query,
	QueryConstraint,
	ref,
	remove,
	set,
	update,
} from "firebase/database";
import { isEmpty, last, map } from "lodash-es";
import moment from "moment";
import { TBaseEntity, TUser, TVenue } from "../types";
import { generateId } from "../utils";
import firebaseConfig from "./config";

class BaseService<TEntity> {
	db: Database;
	collection: string;
	lastEntryId?: string;

	constructor(collection: string) {
		initializeApp(firebaseConfig);
		this.db = getDatabase();
		this.collection = collection;
		this.lastEntryId;
	}

	create = async (entity: TEntity & TBaseEntity) => {
		try {
			if (isEmpty(entity.id)) {
				entity.id = generateId();
			}
			await set(ref(this.db, `${this.collection}/` + entity.id), {
				...entity,
				dateCreated: moment().utc().format(),
				dateUpdated: moment().utc().format(),
			});
			return entity;
		} catch (error) {
			throw error;
		}
	};

	getTotalRecords = async () => {
		try {
			const snapshot = await get(ref(this.db, this.collection));
			return snapshot.size;
		} catch (error) {
			throw error;
		}
	};

	get = async () => {
		try {
			const filters: Array<QueryConstraint> = [];
			// if (this.lastEntryId) {
			// 	filters.push(startAt(this.lastEntryId));
			// }
			const dbQuery = query(
				ref(this.db, this.collection),
				orderByChild("dateCreated"),
				limitToFirst(30),
				...filters
			);
			const snapshot = await get(dbQuery);
			await this.getTotalRecords();
			const records: { [key: string]: TEntity & TBaseEntity } = snapshot.val();
			const items = map(records, (value) => value);
			this.lastEntryId = last(items)?.id;
			const response = await this.buildResponse(items);
			return response;
		} catch (error) {
			throw error;
		}
	};

	buildResponse = async (items: Array<TEntity>) => {
		const totalRecords = await this.getTotalRecords();
		const response = {
			totalRecords,
			items,
			page: 1,
			rpp: 1,
		};
		return response;
	};

	getById = async (id: string): Promise<TEntity> => {
		try {
			const snapshot = await get(ref(this.db, `${this.collection}/${id}`));
			const user = snapshot.val();
			return user;
		} catch (error) {
			throw error;
		}
	};

	update = async (entity: TEntity & TBaseEntity) => {
		try {
			entity.dateUpdated = moment().utc().format();
			await update(ref(this.db, `${this.collection}/${entity.id}`), entity);
		} catch (error) {
			throw error;
		}
	};

	delete = async (id: string) => {
		try {
			await remove(ref(this.db, `${this.collection}/${id}`));
		} catch (error) {
			throw error;
		}
	};
}

export default BaseService;
