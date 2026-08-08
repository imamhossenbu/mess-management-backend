-- AddForeignKey
ALTER TABLE "UtilityBill" ADD CONSTRAINT "UtilityBill_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
