import oracledb from 'oracledb';

export async function executeDML(sql: string, binds: any[] = []) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
    });
    
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