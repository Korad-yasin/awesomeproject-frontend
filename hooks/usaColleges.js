// usaColleges.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';



const UsaColleges = (state) => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        function capitalizeWords(str) {
            return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
          }
        const fetchColleges = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/colleges?state=${state}`);
                setColleges(response.data.map(college => ({
                    label: capitalizeWords(college.name),
                    value: college.name,
                })));
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchColleges();
    }, [state]);

    return { colleges, loading, error };
};

export default UsaColleges;
