import Counter from "@/model/Counter";

class DatabaseUtil {
  async getSeq({ _id }: { _id: string }) {
    const doc = await Counter.findByIdAndUpdate(
      { _id },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (doc && doc.seq) return doc.seq;
    throw new Error("Failed to get sequence number");
  }
}

const PersistanceUtil = new DatabaseUtil();

export default PersistanceUtil;
