import { initializeApp } from "firebase/app";
import {
	get,
	query,
	QueryConstraint,
	ref,
	remove,
	set,
	update,
} from "firebase/database";
import { isEmpty, map } from "lodash-es";
import moment from "moment";
import { TBaseEntity } from "../types";
import { generateId } from "../utils";
import firebaseConfig from "./config";
import db from "./db";

class BaseService<TEntity> {
	collection: string;

	constructor(collection: string) {
		initializeApp(firebaseConfig);
		this.collection = collection;
	}

	create = async (entity: TEntity & TBaseEntity) => {
		try {
			if (isEmpty(entity.id)) {
				entity.id = generateId();
			}
			await set(ref(db, `${this.collection}/` + entity.id), {
				...entity,
				dateCreated: moment().utc().format(),
				dateUpdated: moment().utc().format(),
			});
			return entity;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	getTotalRecords = async () => {
		try {
			const snapshot = await get(ref(db, this.collection));
			return snapshot.size;
		} catch (error) {
			throw error;
		}
	};

	get = async () => {
		try {
			const snapshot = await get(ref(db, this.collection));
			await this.getTotalRecords();
			const records: { [key: string]: TEntity & TBaseEntity } = snapshot.val();
			const items = map(records, (value) => value);
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
			rpp: totalRecords, //Temporary, keeping this function incase paging needs to be implemented
		};
		return response;
	};

	getById = async (id: string): Promise<TEntity> => {
		try {
			const snapshot = await get(ref(db, `${this.collection}/${id}`));
			const user = snapshot.val();
			return user;
		} catch (error) {
			throw error;
		}
	};

	update = async (entity: TEntity & TBaseEntity) => {
		try {
			entity.dateUpdated = moment().utc().format();
			await update(ref(db, `${this.collection}/${entity.id}`), entity);
			const updatedEntity = await this.getById(entity.id!);
			return updatedEntity;
		} catch (error) {
			throw error;
		}
	};

	delete = async (id: string) => {
		try {
			await remove(ref(db, `${this.collection}/${id}`));
		} catch (error) {
			throw error;
		}
	};
}

export default BaseService;
