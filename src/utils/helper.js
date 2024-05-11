export const ExecuteTransaction = async (callback) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Error executing transaction:", error);
    return { success: false, message: "Error executing transaction" };
  } finally {
    connection.release();
  }
};
