import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_GUITAR_DETAILS = gql`
  query FindBrandModels($brandId: ID!, $modelId: ID!) {
    findUniqueModel(brandId: $brandId, modelId: $modelId) {
      description
      price
      name
      image
      musicians {
        musicianImage
        bands
        name
      }
    }
  }
`;


function GuitarDetails({ brandId, modelId }) {
  const [visibleMusicians, setVisibleMusicians] = useState(2);
  const [activeTab, setActiveTab] = useState('Specs');

  const { data, loading, error } = useQuery(GET_GUITAR_DETAILS, {
    variables: {
      brandId,
      modelId
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const model = data.findUniqueModel;
  if (!model) return <p>Guitar not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{model.name}</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab('Specs')}>Specs</button>
        <button onClick={() => setActiveTab('Musicians')}>Musicians</button>
      </div>

      {activeTab === 'Specs' && (
        <div>
          <img src={model.image} alt={model.name} style={{ width: "300px" }} />
          <p><strong>Description:</strong> {model.description}</p>
          <p><strong>Price:</strong> ${model.price}</p>
        </div>
      )}

      {activeTab === 'Musicians' && (
        <div>
          {(model.musicians || []).slice(0, visibleMusicians).map((m, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <img src={m.musicianImage} alt={m.name} style={{ width: "80px", borderRadius: "50%" }} />
              <p><strong>{m.name}</strong></p>
              <p>Bands: {m.bands}</p>
            </div>
          ))}

          {visibleMusicians < model.musicians.length && (
            <button onClick={() => setVisibleMusicians(p => p + 2)}>Show more</button>
          )}
        </div>
      )}
    </div>
  );
}

export default GuitarDetails;
