namespace Core;

public record QuestionTeacherDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, string? ImageName, int PreviewTime, AnswerDto[] Answers, int QuizLength);
public record QuestionStudentDto(int QuestionNumber, string QuestionText, int NumberOfAnswers, int CurrentPoints, int Points, int QuizLength);
public record AnswerPostDto(bool[] Answers, string Username);
public record StatisticDto(string QuizName, Player[] TopThreePlayers, Dictionary<int, List<bool>> QuestionAnswers, QuestionDto[] QuestionTexts, int PlayerCount);
public record RankingDto(Player[] Players, int QuestionNumber, int QuizLength);
public record AnswerDto(string AnswerText, bool IsCorrect);
public record QuestionDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, List<AnswerDto> Answers, string ImageName, int PreviewTime);
public record QuizDto(int Id, string Title, string Description, string CreatorName, List<QuestionDto> Questions, string ImageName);

public record QuizPostDto(string Title, string Description, string Creator, List<QuestionDto> Questions, string ImageName);