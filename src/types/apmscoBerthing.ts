export interface ApmscoMovementOption {
  value: string;
  labelEn: string;
  labelAr: string;
}

export const getApmscoMovementLabel = (
  movement: ApmscoMovementOption,
  language: 'ar' | 'en',
): string => (language === 'ar' ? movement.labelAr : movement.labelEn);

export const buildApmscoMovementValueMap = (
  movements: readonly ApmscoMovementOption[],
): Map<string, ApmscoMovementOption> => {
  const movementMap = new Map<string, ApmscoMovementOption>();

  movements.forEach((movement) => {
    movementMap.set(movement.value, movement);
  });

  return movementMap;
};
