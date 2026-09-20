import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const TaxiContext = createContext();

export const TaxiProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          date: item.date,
          type: item.type,
          amount: item.amount,
          description: item.description,
          image: item.image_url,
          createdAt: item.created_at,
          status: item.status || 'pending'
        }));
        setReports(formattedData);
      }
    } catch (err) {
      console.error('Unexpected error fetching reports:', err);
    }
  };

  const addReport = async (reportData) => {
    let imageUrl = null;

    if (reportData.imageFile) {
      const file = reportData.imageFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const bucketName = import.meta.env.VITE_SUPABASE_RECEIPTS_BUCKET || 'receipts';
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      imageUrl = data.publicUrl;
    }

    const newRecord = {
      date: reportData.date,
      type: reportData.type,
      amount: Number(reportData.amount),
      description: reportData.description || null,
      image_url: imageUrl,
      status: 'pending' // new reports are pending by default
    };

    const { data: insertedData, error: dbError } = await supabase
      .from('reports')
      .insert([newRecord])
      .select();

    if (dbError) {
      console.error('Error inserting report:', dbError);
      throw dbError;
    }

    if (insertedData && insertedData.length > 0) {
      const item = insertedData[0];
      const newReport = {
        id: item.id,
        date: item.date,
        type: item.type,
        amount: item.amount,
        description: item.description,
        image: item.image_url,
        createdAt: item.created_at,
        status: item.status || 'pending'
      };
      setReports([newReport, ...reports]);
    }
  };

  const deleteReport = async (id) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting report:', error);
        throw error;
      }
      
      setReports(reports.filter(report => report.id !== id));
    } catch (err) {
      console.error('Unexpected error deleting report:', err);
      throw err;
    }
  };

  const updateReportStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating report status:', error);
        alert('Debes ir a Supabase y agregar una columna llamada "status" (tipo text) a tu tabla "reports".');
        throw error;
      }
      
      setReports(reports.map(report => 
        report.id === id ? { ...report, status } : report
      ));
    } catch (err) {
      console.error('Unexpected error updating status:', err);
    }
  };

  return (
    <TaxiContext.Provider value={{ reports, addReport, fetchReports, deleteReport, updateReportStatus }}>
      {children}
    </TaxiContext.Provider>
  );
};
