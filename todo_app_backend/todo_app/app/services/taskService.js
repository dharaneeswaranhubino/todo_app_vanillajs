const db = require("../config/db");
module.exports.getAllTaskList = async (status, page, limit) => {
  try {
    // let gq = `SELECT * FROM NEW_TODOS`;
    // const values = [];

    // if(status){
    //     gq += ` WHERE TASKSTATUS = ?`;
    //     values.push(status)
    // }

    // gq += ` ORDER BY CREATEDAT DESC`;

    // const [allTask] = await db.query(gq,values);
    // return allTask;

    //FOR ADDING PAGINATION
    let offset = (page - 1) * limit;
    let where = "";
    let filterValue = [];

    if (status) {
      where = `WHERE TASKSTATUS =?`;
      filterValue.push(status);
    }

    // for get paginated row
    let gq = `SELECT * FROM NEW_TODOS ${where} ORDER BY CREATEDAT DESC LIMIT ? OFFSET ?`;
    let values = [...filterValue,limit, offset];
    const [rows] = await db.query(gq, values);

    // for get total count
    const [countRow] = await db.query(
      `SELECT COUNT(*) AS TOTALCOUNT FROM NEW_TODOS ${where}`,
      filterValue,
    );
    // const [countRow] = await db.query(
    //   `SELECT COUNT(*) AS TOTALCOUNT FROM NEW_TODOS ${where}`,
    //   value,
    // );

    const totalCount = countRow[0].TOTALCOUNT;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      todos: rows,
      totalPages,
      currentPage: page,
      totalCount,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.addTasks = async (taskData) => {
  try {
    const pq =
      "INSERT INTO NEW_TODOS(`tasks`,`taskStatus`,`statusCode`) values(?,'pending',0)";
    const values = [taskData.tasks];
    return await db.query(pq, values);
  } catch (err) {
    throw err;
  }
};

module.exports.editTask = async (taskData, taskId) => {
  try {
    const eq = `UPDATE NEW_TODOS SET TASKS=? WHERE ID =?`;
    const value = taskData.tasks;
    return await db.query(eq, [value, taskId]);
  } catch (err) {
    throw err;
  }
};

module.exports.deleteTasks = async (taskId) => {
  try {
    const dq = "DELETE FROM NEW_TODOS WHERE ID = ?";
    return await db.query(dq, [taskId]);
  } catch (err) {
    throw err;
  }
};

module.exports.updateTaskStatus = async (id, status) => {
  try {
    let statusCode = 0;
    let completedAt = null;
    if (status == "completed") {
      statusCode = 1;
      completedAt = new Date();
    } else if (status == "rejected") {
      statusCode = 2;
    }
    const uscq = `UPDATE NEW_TODOS SET COMPLETEDAT=?, UPDATEDAT=NOW(), TASKSTATUS=?, STATUSCODE=? WHERE ID=?`;
    const values = [completedAt, status, statusCode, id];
    return await db.query(uscq, values);
  } catch (err) {
    throw err;
  }
};
