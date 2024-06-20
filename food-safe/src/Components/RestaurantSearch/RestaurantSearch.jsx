import SearchResults from "../SearchResults/SearchResults";
import axios from "axios";
const API_URL = "http://localhost:8080/search";
import "./RestaurantSearch.scss";
import { useState } from "react";

function RestaurantSearch() {
	const [results, setResults] = useState(null);

	async function handleSubmit(event) {
		event.preventDefault();
		const query = event.target.search.value;
		event.target.reset();

		await getResults(query);
	}

	async function getResults(quer) {
		try {
			const result = await axios.get(API_URL, { params: { q: quer } });
			const data = result.data;
			setResults(data);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<section>
			<div className="restaurant-search">
				<h3>Search a Restaurant</h3>
				<form onSubmit={handleSubmit}>
					<div className="search-field">
						<img src="/src/assets/search.svg" alt="search icon" />
						<input
							id="search"
							type="text"
							className="input"
							placeholder="Search"
						/>
					</div>
					<button className="button" type="submit">
						SUBMIT
					</button>
				</form>
			</div>
			<SearchResults results={results} />
			<div className="site-promo">
				<h4 className="promo-title">Why choose DineSafe?</h4>
				<div className="promotion-blocks">
					<div className="promo-block">
						<h4>Verified Hygiene Ratings</h4>
						<p>
							Access comprehensive hygiene reports and ratings from trusted
							health authorities.
						</p>
					</div>
					<div className="promo-block">
						<h4>Up-to-date Information</h4>
						<p>
							Stay informed with the latest health inspection results and
							compliance updates.
						</p>
					</div>
					<div className="promo-block">
						<h4>User Reviews and Feedback</h4>
						<p>
							Read real reviews from fellow diners and share your own
							experiences.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default RestaurantSearch;
