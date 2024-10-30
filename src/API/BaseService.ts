import { initializeApp } from "firebase/app";
import {
	equalTo,
	get,
	orderByChild,
	query,
	ref,
	remove,
	set,
	update,
} from "firebase/database";
import { filter, isEmpty, map } from "lodash-es";
import moment from "moment";
import { TBaseEntity } from "../types";
import { generateId, removeFalsyValues, successToast } from "../utils";
import firebaseConfig from "./config";
import db from "./db";
import { errorConstants, successConstants } from "../constants";

class BaseService<TEntity> {
	collection: string;

	constructor(collection: string) {
		initializeApp(firebaseConfig);
		this.collection = collection;
	}

	create = async (entity: TEntity & TBaseEntity) => {
		try {
			entity = removeFalsyValues(entity) as TEntity & TBaseEntity;
			if (isEmpty(entity.id)) {
				entity.id = generateId();
			}
			await set(ref(db, `${this.collection}/` + entity.id), {
				...entity,
				dateCreated: moment().utc().format(),
				dateUpdated: moment().utc().format(),
			});
			successToast(successConstants.createSuccess);
			return entity;
		} catch (error) {
			throw errorConstants.createError;
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
			throw errorConstants.fetchError;
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
			throw errorConstants.fetchError;
		}
	};

	search = async (searchProperty: string, searchValue: string) => {
		try {
			const searchQuery = query(ref(db, this.collection));
			const snapshot = await get(searchQuery);
			return filter(snapshot.val(), (val: any) => {
				return val[searchProperty] === searchValue;
			});
		} catch (error) {
			throw errorConstants.fetchError;
		}
	};

	update = async (entity: TEntity & TBaseEntity) => {
		try {
			entity = removeFalsyValues(entity) as TEntity & TBaseEntity;
			entity.dateUpdated = moment().utc().format();
			await update(ref(db, `${this.collection}/${entity.id}`), entity);
			const updatedEntity = await this.getById(entity.id!);
			successToast(successConstants.updateSuccess);
			return updatedEntity;
		} catch (error) {
			throw errorConstants.updateError;
		}
	};

	delete = async (id: string) => {
		try {
			await remove(ref(db, `${this.collection}/${id}`));
			successToast(successConstants.deleteSuccess);
		} catch (error) {
			throw errorConstants.deleteError;
		}
	};
}

export default BaseService;
