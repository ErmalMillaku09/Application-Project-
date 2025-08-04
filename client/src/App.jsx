import './App.css';
import { useQuery, gql } from "@apollo/client";
import { Routes, Route, Link, useParams } from 'react-router-dom';
import BrandModels from './BrandModels';
import GuitarDetails from './GuitarDetails';

// Queries
const GET_BRANDS = gql`
  query findAllBrands {
    findAllBrands {
      id
      image
      name  
    }
  }
`;

function BrandList() {
  const { data, error, loading } = useQuery(GET_BRANDS);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  return (
    <>
      <h1>Brands</h1>
      <div className="container">
        {data?.findAllBrands?.map((brand) => (
          <Link to={`/brand/${brand.id}`} key={brand.id} className="brand_item">
            <img src={brand.image} alt={brand.name} style={{ width: '150px', height: '150px' }} />
          </Link>
        ))}
      </div>
    </>
  );
}

function BrandModelsWrapper() {
  const { brandId } = useParams();
  return <BrandModels brandId={brandId} onBackClick={() => window.history.back()} />;
}

function GuitarDetailsWrapper() {
  const { brandId, modelId } = useParams();
  return <GuitarDetails brandId={brandId} modelId={modelId} />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BrandList />} />
        <Route path="/brand/:brandId" element={<BrandModelsWrapper />} />
       <Route path="/guitar/:brandId/:modelId" element={<GuitarDetailsWrapper />} />
      </Routes>
    </div>
  );
}

export default App;
