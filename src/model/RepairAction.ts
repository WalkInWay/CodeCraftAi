import Stream from "./Stream";

export default class RepairAction {
    constructor(
        public target: number,
    ) {}

    static async readFrom(stream: Stream): Promise<RepairAction> {
        const target = await stream.readInt();
        return new RepairAction(target);
    }

    async writeTo(stream: Stream) {
        await stream.writeInt(this.target);
    }
}
