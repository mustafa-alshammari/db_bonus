import oracledb from 'oracledb';

export async function executeDML(sql: string, binds: any[] = []) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'password',
      connectString: 'localhost/xepdb1',
    });

    console.log("Connected Successfully")
    
    const result = await connection.execute(sql, binds, { 
        autoCommit: true, 
        outFormat: oracledb.OUT_FORMAT_OBJECT 
    });
    
    return result.rows || [];
  } catch (err) {
    console.error("Database execution error:", err);
    throw new Error('Failed to execute query');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}