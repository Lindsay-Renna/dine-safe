import "./SearchResults.scss";

function SearchResults({ results }) {
	return (
		<div className="search-results">
			<h4>Results</h4>
			{results && results.length > 0 ? (
				<table className="results-table">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Address</th>
							<th scope="col">Type</th>
							<th scope="col">Status</th>
							<th scope="col">Severity</th>
							<th scope="col">Details</th>
							<th scope="col">Date</th>
							<th scope="col">Action</th>
							<th scope="col">Outcome</th>
							<th scope="col">Fine</th>
						</tr>
					</thead>
					<tbody>
						{results.map((result, index) => (
							<tr key={index}>
								<th scope="row">{result.name}</th>
								<td>{result.address}</td>
								<td>{result.type}</td>
								<td>{result.status}</td>
								<td>{result.severity}</td>
								<td>{result.details}</td>
								<td>{result.date}</td>
								<td>{result.action}</td>
								<td>{result.outcome}</td>
								<td>{result.fine}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>There are no records for this restaurant. Happy Dining!</p>
			)}
		</div>
	);
}

export default SearchResults;
