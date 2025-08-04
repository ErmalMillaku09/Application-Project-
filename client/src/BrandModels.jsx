import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Needed for navigation

// GraphQL query to get models
const GET_BRAND_MODELS = gql`
  query FindBrandModels($findBrandModelsId: ID!, $sortBy: sortBy!) {
    findBrandModels(id: $findBrandModelsId, sortBy: $sortBy) {
      id
      image
      name
      price
      type
    }
  }
`;

function BrandModels({ brandId, onBackClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, loading, error } = useQuery(GET_BRAND_MODELS, {
    variables: {
      findBrandModelsId: brandId,
      sortBy: {
        field: "price",
        order: "ASC"
      }
    }
  });

  if (loading) return <h1>Loading models...</h1>;
  if (error) return <h1>Error fetching models: {error.message}</h1>;

  const filteredModels = data.findBrandModels
    .filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(model =>
      selectedType === "All" || model.type === selectedType
    );

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedModels = filteredModels.slice(startIndex, startIndex + itemsPerPage);

  const uniqueTypes = ["All", ...new Set(data.findBrandModels.map(m => m.type))];

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBackClick} style={{ margin: '20px' }}>&larr; Back to Brands</button>
      <h1>Models</h1>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by model name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
        >
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Models Display */}
      <div className="container">
        {paginatedModels.map(model => (
          <div className="brand_item" key={model.id}>
            <img src={model.image} alt={model.name} style={{ width: '150px', height: '150px' }} />
            <p>{model.name}</p>
            <p>${model.price}</p>
            <p>Type: {model.type}</p>

            {/* View Details Link */}
          <Link
           to={`/guitar/${brandId}/${model.id}`}
            style={{ textDecoration: 'underline', color: 'blue' }}
            >
  View Details
</Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BrandModels;
