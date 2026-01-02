/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchdataProgressApi } from "../../services/api/progress.services";

const screenWidth = Dimensions.get("window").width;
type LessonStatus =
  | 'open'
  | 'close'
  | 'passed'
  | 'in_progress'
  | 'failed'
  | 'paused';

const STATUS_SCORE: Record<
  'open' | 'close' | 'passed' | 'in_progress' | 'failed' | 'paused',
  number
> = {
  open: 0,
  close: 0,
  passed: 100,
  in_progress: 50,
  paused: 30,
  failed: 10,
};

const Progresslog = ({userId}: any) => {
  const progress = useSelector((state: RootState) => state.progress.progress);
  const [loading, setloading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [pg, setPg] = useState<any>(null);
  useEffect(() => {
    if (!progress?._id) return;

    setloading(true);
    fetchdataProgressApi(progress._id)
      .then(res => {
        setPg(res.data); // 🔥 QUAN TRỌNG
      })
      .finally(() => setloading(false));
  }, [progress?._id]);

  if (!pg || pg.Listlesson.length === 0) {
    return <Text>Chưa có dữ liệu tiến độ</Text>;
  }

  const labels = pg.Listlesson?.map(
    (_: any, i: any) => `${_?.lesson?.title}`
  );

  const scores = pg.Listlesson.map(
    (item: any) => STATUS_SCORE[item.status as LessonStatus]?? 0
  );

  return (
    <ScrollView>
      <Text style={styles.title}>Tiến độ học tập</Text>

      <BarChart
        data={{
          labels,
          datasets: [{ data: scores }],
        }}
        width={screenWidth - 40}
        height={220}
        fromZero
        yAxisLabel=""        // ✅ thêm
        yAxisSuffix=""       // ✅ thêm
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f5f5f5",
          backgroundGradientTo: "#e8e8e8",
          decimalPlaces: 0,
          color: (o = 1) => `rgba(0,122,255,${o})`,
          labelColor: (o = 1) => `rgba(0,0,0,${o})`,
        }}
        style={styles.chart}
      />
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setDetailVisible(v => !v)}
      >
        <Text style={styles.toggleBtnText}>
          {detailVisible ? "Ẩn chi tiết" : "Xem chi tiết"}
        </Text>
      </TouchableOpacity>

      {detailVisible && (
        <View style={{ marginTop: 10 } as any}>
          {pg.Listlesson.map((item: any, idx: any) => (
            <View key={idx} style={styles.detailCard}>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Lesson:</Text> {item.lesson?.title}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Status:</Text> {item.status}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Step:</Text> {item.step}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Retake:</Text> {item.retakeCount}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Progresslog;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },
  toggleBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
    minWidth: 120,
    alignItems: "center",
  },
  toggleBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 2,
    color: '#000',
  },
  bold: {
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
