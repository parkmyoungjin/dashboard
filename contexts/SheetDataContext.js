import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SheetDataContext = createContext();

export function SheetDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/sheets?sheet=ProgressSection');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newData = await response.json();
      
      // 데이터가 실제로 변경되었는지 확인
      const newDataString = JSON.stringify(newData);
      if (lastUpdate !== newDataString) {
        console.log('시트 데이터 업데이트:', new Date().toLocaleTimeString());
        setData(newData);
        setLastUpdate(newDataString);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [lastUpdate]);

  // 초기 데이터 로드 및 주기적 업데이트 설정
  useEffect(() => {
    fetchData(); // 초기 데이터 로드

    // 30초마다 업데이트 확인
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <SheetDataContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </SheetDataContext.Provider>
  );
}

export function useSheetData() {
  const context = useContext(SheetDataContext);
  if (!context) {
    throw new Error('useSheetData must be used within a SheetDataProvider');
  }
  return context;
} 