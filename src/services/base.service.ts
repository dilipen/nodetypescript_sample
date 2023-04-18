import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { pool } from 'db/postgres';

import { default as format } from 'pg-format';

class BaseService {
  public async find(table_name: string, where: string): Promise<any[]> {
    var promise: Promise<User[]> = new Promise((resolve: any, reject: any) => {
      (async () => {
        var client = null;
        try {
          var fmt: string = `select * from ${table_name} where ${where}`;
          var args: any[] = [];
          var sql: string = format(fmt, args);
          client = await pool.connect();
          const result = await client.query(sql);
          client.release();
          resolve(result['rows']);
        } catch (err) {
          reject(err);
        } finally {
          try {
            client.release()
          } catch { }
        }
      })();
    });
    return promise;
  }
  
  public async findAll(table_name: string): Promise<any[]> {
    var promise: Promise<User[]> = new Promise((resolve: any, reject: any) => {
      (async () => {
        var client = null;
        try {
          var fmt: string = `select * from ${table_name}`;
          var args: any[] = [];
          var sql: string = format(fmt, args);
          client = await pool.connect();
          const result = await client.query(sql);
          client.release();
          resolve(result['rows']);
        } catch (err) {
          reject(err);
        } finally {
          try {
            client.release()
          } catch { }
        }
      })();
    });
    return promise;
  }

  public async findById(table_name: string, id: number): Promise<any> {
    var promise: Promise<any> = new Promise((resolve: any, reject: any) => {
      (async () => {
        var client = null;
        try {
          var fmt: string = `select * from ${table_name} where id = %s limit 1`;
          var args: any[] = [id];
          var sql: string = format(fmt, args);
          client = await pool.connect();
          const result = await client.query(sql);
          if (result['rowCount'] == 1) {
            resolve(result['rows'][0]);
          } else {
            reject('Not found')
          }
        } catch (err) {
          reject(err)
        } finally {
          try {
            client.release()
          } catch { }
        }
      })();
    });
    return promise;
  }

  public async create(table_name: string, data: any): Promise<any> {
    if (isEmpty(data)) throw new HttpException(400, "data is empty");
    var promise: Promise<any> = new Promise((resolve: any, reject: any) => {
      (async () => {
        var client = null;
        try {
          const columns = Object.keys(data);
          const args = Object.values(data);
          const columns_str = columns.join(', ');
          const parsers = [];
          for (var i in columns) {
            parsers.push("'%s'");
          }
          const parser_str = parsers.join(', ');
          var fmt = `insert into ${table_name} (${columns_str}) values (${parser_str})`;
          var sql: string = format(fmt, ...args);
          console.log('sql', sql)
          client = await pool.connect();
          const result = await client.query(sql);
          // console.log(result);
          resolve(result['rowCount'])
        } catch (err) {
          reject(err)
        } finally {
          try {
            client.release()
          } catch { }
        }
      })();
    });
    return promise;
  }

  public async update(table_name: string, data: any, where: string): Promise<any> {
    if (isEmpty(data)) throw new HttpException(400, "data is empty");
    var promise: Promise<any> = new Promise((resolve: any, reject: any) => {
      (async () => {
        var client = null;
        try {
          const columns = Object.keys(data);
          const args = Object.values(data);
          const parsers = [];
          for (var i of columns) {
            parsers.push(`${i} = '%s'`);
          }
          const parser_str = parsers.join(', ');
          var fmt = `update ${table_name} set ${parser_str} where ${where}`;
          var sql: string = format(fmt, ...args);
          console.log('sql', sql)
          client = await pool.connect();
          const result = await client.query(sql);
          // console.log(result);
          resolve(result['rowCount'])
        } catch (err) {
          reject(err)
        } finally {
          try {
            client.release()
          } catch { }
        }
      })();
    });
    return promise;
  }

  public async delete(table_name: string, where: string): Promise<any> {
    if (isEmpty(where)) throw new HttpException(400, "where is empty");
    var promise: Promise<any> = new Promise((resolve: any, reject: any) => {
      (async () => {
        var client = null;
        try {
          var fmt = `delete from ${table_name} where ${where}`;
          var sql: string = format(fmt, ...[]);
          console.log('sql', sql)
          client = await pool.connect();
          const result = await client.query(sql);
          // console.log(result);
          resolve(result['rowCount'])
        } catch (err) {
          reject(err)
        } finally {
          try {
            client.release()
          } catch { }
        }
      })();
    });
    return promise;
  }

  public subwhere(where_list={}) {
    const columns = Object.keys(where_list);
    const parsers = [];
    for (var i of columns) {
      parsers.push(`${i} = '${where_list[i]}'`);
    }
    const parser_str = parsers.join(' and ');
    return parser_str;
  }
}

export default BaseService;
