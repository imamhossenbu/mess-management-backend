-- Existing users and memberships predate the approval and multi-role fields.
-- Keep their current access level intact after the schema upgrade.
UPDATE "User"
SET "approvalStatus" = 'APPROVED'
WHERE "isActive" = true;

UPDATE "MessMember"
SET "roles" = ARRAY["role"]::"MessRole"[]
WHERE "role" <> 'MEMBER'
  AND "roles" = ARRAY['MEMBER']::"MessRole"[];
