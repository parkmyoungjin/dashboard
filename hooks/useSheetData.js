import { useState, useEffect, useCallback, useRef } from 'react';

export function useSheetData(sheetName, interval = 30000) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastUpdateRef = useRef(null);

  // useCallback을 사용하여 fetchData 함수 메모이제이션
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/sheets?sheet=${sheetName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newData = await response.json();
      
      // 데이터가 실제로 변경되었는지 확인
      const newDataString = JSON.stringify(newData);
      if (lastUpdateRef.current !== newDataString) {
        console.log(`[${sheetName}] 데이터 업데이트:`, new Date().toLocaleTimeString());
        setData(newData);
        lastUpdateRef.current = newDataString;
      }
      
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${sheetName} data:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [sheetName]); // fetchData의 의존성 배열에서 lastUpdate 제거

  // 초기 데이터 로드 및 주기적 업데이트 설정
  useEffect(() => {
    fetchData(); // 초기 데이터 로드

    // 주기적 업데이트 설정
    const intervalId = setInterval(fetchData, interval);

    // 컴포넌트 언마운트 시 정리
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return { data, loading, error, refetch: fetchData };
} 