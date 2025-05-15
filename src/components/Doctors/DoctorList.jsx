import DoctorCard from "./DoctorCard";
import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/userFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const DoctorList = () => {
  const {
    data: doctors,
    loading,
    error,
  } = useFetchData(`${BASE_URL}`);

  // If data is loading or hasn't been fetched yet
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader />
      </div>
    );
  }

  // If there was an error fetching data
  if (error) {
    return (
      <div className="text-center py-10">
        <Error message={error.message || "Failed to load doctors"} />
      </div>
    );
  }

  // If data loaded successfully but is null/undefined
  if (!doctors) {
    return (
      <div className="text-center py-10 text-gray-500">
        No doctor data available
      </div>
    );
  }

  // If data loaded successfully but empty array
  if (doctors.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No doctors found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
      {doctors.map((doctor) => (
        <DoctorCard 
          key={doctor.id || doctor._id} 
          doctor={doctor} 
        />
      ))}
    </div>
  );
};

export default DoctorList;