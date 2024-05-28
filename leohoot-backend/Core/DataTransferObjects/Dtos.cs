namespace Core.DataTransferObjects;
public record QuestionTeacherDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, string? ImageName, string? Snapshot, int PreviewTime, AnswerDto[] Answers, bool ShowMultipleChoice, int QuizLength);
public record QuestionStudentDto(int QuestionNumber, string QuestionText, int NumberOfAnswers, int CurrentPoints, int Points, int QuizLength);
public record AnswerPostDto(bool[] Answers, string Username);
public record StatisticDto(string QuizName, Player[] TopThreePlayers, Dictionary<int, List<bool>> QuestionAnswers, QuestionDto[] QuestionTexts, int PlayerCount);
public record RankingDto(Player[] Players, int QuestionNumber, int QuizLength);
public record AnswerDto(string AnswerText, bool IsCorrect);
public record QuestionDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, List<AnswerDto> Answers, string? ImageName, int PreviewTime, string? Snapshot, bool ShowMultipleChoice);
public record QuizDto(int Id, string Title, string? Description, string Creator, List<QuestionDto> Questions, List<TagDto> Tags, string? ImageName);
public record QuizPostDto(string Title, string Description, string Creator, List<QuestionDto> Questions, List<TagDto> Tags, string ImageName);
public record UserDto(string Username, string Password);
public record TagDto(string Name);
public record AuthResponseDto(bool IsAuthSuccessful, string? ErrorMessage, string? Token);
