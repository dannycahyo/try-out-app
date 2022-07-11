import {
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

type Statistic = {
  isPassedTheTest: boolean;
  isFailedTheTest: boolean;
  correctAnswer: number;
  elapsed: number;
  duration: number;
};

const StatisticSection = ({
  isPassedTheTest,
  isFailedTheTest,
  correctAnswer,
  elapsed,
  duration,
}: Statistic) => {
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Score</StatLabel>

        <StatNumber>{correctAnswer * 10}</StatNumber>
        <StatHelpText>
          {isPassedTheTest ? (
            <StatArrow type="increase" />
          ) : isFailedTheTest ? (
            <StatArrow type="decrease" />
          ) : null}
          KKM 70
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Time</StatLabel>
        <StatNumber>{Math.floor(elapsed)}</StatNumber>
        <StatHelpText>
          {isPassedTheTest ? (
            <StatArrow type="increase" />
          ) : isFailedTheTest ? (
            <StatArrow type="decrease" />
          ) : null}
          Duration {duration}
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Correct Answer</StatLabel>
        <StatNumber>{correctAnswer}</StatNumber>
        <StatHelpText>
          {isPassedTheTest ? (
            <StatArrow type="increase" />
          ) : isFailedTheTest ? (
            <StatArrow type="decrease" />
          ) : null}
          Minimum 7 Correct
        </StatHelpText>
      </Stat>
    </StatGroup>
  );
};

export default StatisticSection;
