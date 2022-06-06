import styles from "./Table.module.css";

const Table: React.FC<{ columnNames: string[]; rowsData: string[][] }> = (
  props
) => {
  return (
    <div className={styles.container}>
      <div className={styles.columnsContainer}>
        {props.columnNames.map((columnName, i) => (
          <div key={i}>{columnName}</div>
        ))}
      </div>
      <div className={styles.rowsContainer}>
        {props.rowsData.map((row, i) => (
          <div className={styles.rowContainer} key={i}>
            {row.map((data, i) => (
              <div key={i}>{data}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
