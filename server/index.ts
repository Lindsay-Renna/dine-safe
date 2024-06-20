import { Database, OPEN_CREATE } from "sqlite3";
import { parse } from "@fast-csv/parse";
import { readFileSync } from "fs";
import { exit } from "process";
import express from "express";
import cors from "cors";

function createTables(newdb: Database) {
  newdb.exec(
    `
          CREATE TABLE IF NOT EXISTS dinesafe (
              id INT PRIMARY KEY NOT NULL,
              establishment_id INT,
              inspection_id INT,
              establishment_name TEXT,
              establishment_type TEXT,
              establishment_address TEXT,
              establishment_status TEXT,
              min_inspections_per_year TEXT,
              infraction_details TEXT,
              inspection_date TEXT,
              severity TEXT,
              action TEXT,
              outcome TEXT,
              amount_fined TEXT,
              latitude TEXT,
              longitude TEXT,
              unique_id TEXT
          );    
      `,
    (err) => {
      if (err) {
        console.error("Error creating table: ", err.message);
        return;
      }

      const insertData: any[] = [];
      const fp = parse({ headers: true, trim: true })
        .on("error", (error: Error) =>
          console.error("Error parsing CSV: ", error)
        )
        .on("data", (row: any) => {
          const values = [
            parseInt(row["_id"], 10),
            parseInt(row["Establishment ID"], 10),
            parseInt(row["Inspection ID"], 10),
            row["Establishment Name"],
            row["Establishment Type"],
            row["Establishment Address"],
            row["Establishment Status"],
            row["Min. Inspections Per Year"],
            row["Infraction Details"],
            row["Inspection Date"],
            row["Severity"],
            row["Action"],
            row["Outcome"],
            row["Amount Fined"],
            row["Latitude"],
            row["Longitude"],
            row["unique_id"],
          ];

          insertData.push(values);
        })
        .on("end", (rowCount: number) => {
          console.debug(`Parsed ${rowCount} rows from CSV.`);

          // Begin transaction
          newdb.exec("BEGIN TRANSACTION", (err) => {
            if (err) {
              console.error("Error starting transaction: ", err.message);
              return;
            }

            const query = `
                INSERT INTO dinesafe (
                    id,
                    establishment_id,
                    inspection_id,
                    establishment_name,
                    establishment_type,
                    establishment_address,
                    establishment_status,
                    min_inspections_per_year,
                    infraction_details,
                    inspection_date,
                    severity,
                    action,
                    outcome,
                    amount_fined,
                    latitude,
                    longitude,
                    unique_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
              `;

            const stmt = newdb.prepare(query);

            // Insert all data within the transaction
            for (const values of insertData) {
              stmt.run(values, (err) => {
                if (err) {
                  console.error("Error inserting data: ", err.message);
                }
              });
            }

            stmt.finalize((err) => {
              if (err) {
                console.error("Error finalizing statement: ", err.message);
                return;
              }

              // Commit transaction
              newdb.exec("COMMIT", (err) => {
                if (err) {
                  console.error("Error committing transaction: ", err.message);
                } else {
                  console.log("Transaction committed successfully.");
                }
              });
            });
          });
        });

      const fsData = readFileSync("./data/Dinesafe.csv", "utf8");
      fp.write(fsData);
      fp.end();
    }
  );
}

function createDatabase() {
	const newdb = new Database("./data/Dinesafe.db", (err) => {
		if (err) {
			console.error("Getting error: %s", err);
			exit(1);
		}
		newdb.all(
			`SELECT name FROM sqlite_master WHERE type='table' AND name='dinesafe';`,
			(err, rows) => {
				if (rows.length == 0) {
					createTables(newdb);
				}
			}
		);
	});
	return newdb;
}

function initWebServer(db: Database) {
  /**
   * Create express endpoints
   */
  const app = express();
  app.use(cors());

	app.get("/", (req, res) => {
		res.send("This is Dr. Frasier Crane... I'm listening.");
	});

	app.get("/search", (req, res) => {
		try {
			const searchQuery = req.query.q;

			console.log("Lookin' for %s", req.query.q);

      db.all(
        `SELECT * FROM dinesafe WHERE establishment_address LIKE "%" || ? || "%" OR establishment_name LIKE "%" || ? || "%" LIMIT 20;`,
        [searchQuery, searchQuery],
        (err, rows) => {
          if (err) {
            console.error(err);
            throw new Error("OOF! *Roblox crash noise*");
          }
          if (rows.length == 0) {
            res.status(204).send("No results found :(");
          } else {
            let respData = rows.map((item: any, index) => {
              return {
                name: `${item.establishment_name}`,
                address: `${item.establishment_address}`,
                type: `${item.establishment_type}`,
                status: `${item.establishment_status}`,
                severity: `${item.severity}`,
                details: `${item.infraction_details}`,
                date: `${item.inspection_date}`,
                action: `${item.action}`,
                outcome: `${item.outcome}`,
                fined: `${item.amount_fined}`,
              };
            });
            res.status(200).json(respData);
          }
        }
      );
    } catch {
      res
        .status(500)
        .send(
          "Oopsy!  Something went wrong!  A herd of cats has been dispatched to investigate the issue >(^.^)<."
        );
    }
  });
  return app;
}

function main() {
	console.debug("Loading server instance ");
	const db = createDatabase();
	const app = initWebServer(db);
	app.listen(8080, () => {
		console.log("Server listening on Port", 8080);
	});
}

main();
