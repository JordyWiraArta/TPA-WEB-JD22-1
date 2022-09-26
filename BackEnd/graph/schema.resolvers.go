package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jordywiraarta/golang-graphql/database"
	"github.com/jordywiraarta/golang-graphql/graph/generated"
	"github.com/jordywiraarta/golang-graphql/graph/model"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"golang.org/x/crypto/bcrypt"
	gomail "gopkg.in/gomail.v2"
	"gorm.io/gorm"
)

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	pass, _ := HashPassword(input.Password)
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("email LIKE ?", input.Email).Take(&valuser).Error

	if err1 != nil {
		if err1 == gorm.ErrRecordNotFound {
			user := &model.User{
				ID:              uuid.NewString(),
				FirstName:       input.FirstName,
				LastName:        input.LastName,
				Email:           input.Email,
				Password:        pass,
				ProfilePhoto:    "",
				BackgroundPhoto: "",
				Headline:        "",
				Job:             "",
				IsActive:        false,
				ActiveCode:      uuid.NewString(),
			}

			err := r.DB.Create(user).Error

			msg := gomail.NewMessage()
			msg.SetHeader("From", "vbsnet1@gmail.com")
			msg.SetHeader("To", input.Email)
			msg.SetHeader("Subject", "linkhedIn Activation")
			msg.SetBody("text/html", "click this link to activate account! http://localhost:5173/verification/"+user.ActiveCode)

			n := gomail.NewDialer("smtp.gmail.com", 587, "vbsnet1@gmail.com", "rfwrcbvdqwvnoslk")

			// Send the email
			if err := n.DialAndSend(msg); err != nil {
				panic(err)
			}
			return user, err
		}
	}

	return nil, gqlerror.Errorf("email already registered!")
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, id string, code string, input model.UpdateUser) (*model.User, error) {
	db := database.GetDB()

	user := &model.User{}

	if code != "" && id == "reset" {

		var valuser model.User
		err1 := db.Model(valuser).Where("active_code LIKE ?", code).Take(&valuser).Error
		if err1 != nil {
			return nil, gqlerror.Errorf("code invalid")
		}

		if !valuser.IsActive {
			return nil, gqlerror.Errorf("code invalid")
		}

		pass, _ := HashPassword(input.Password)
		err := db.Model(&user).Where("active_code = ?", code).Update("password", pass).Error
		db.Model(&user).Where("id = ?", valuser.ID).Update("active_code", uuid.NewString())
		return user, err

	} else if code != "" {

		var valuser model.User
		err1 := db.Model(valuser).Where("active_code LIKE ?", code).Take(&valuser).Error
		if err1 != nil {
			return nil, gqlerror.Errorf("not found")
		}

		err := db.Model(&user).Where("active_code = ?", code).Update("is_active", true).Error
		db.Model(&user).Where("id = ?", valuser.ID).Update("active_code", uuid.NewString())
		return user, err

	} else {

		currUser := &model.User{ID: id}
		r.DB.First(currUser)

		first_name := currUser.FirstName
		last_name := currUser.LastName
		email := currUser.Email
		password := currUser.Password
		profile_photo := currUser.ProfilePhoto
		background_photo := currUser.BackgroundPhoto
		headline := currUser.Headline
		job := currUser.Job

		if input.FirstName != "" {
			first_name = input.FirstName
		}

		if input.LastName != "" {
			last_name = input.LastName
		}

		if input.Email != "" {
			email = input.Email
		}

		if input.Password != "" {
			password = input.Password
		}

		if input.ProfilePhoto != "" {
			profile_photo = input.ProfilePhoto
		}

		if input.BackgroundPhoto != "" {
			background_photo = input.BackgroundPhoto
		}

		if input.Headline != "" {
			headline = input.Headline
		}

		if input.Job != "" {
			job = input.Job
		}

		err := db.Model(&user).Where("id = ?", id).Updates(model.User{
			FirstName:       first_name,
			LastName:        last_name,
			Email:           email,
			Password:        password,
			ProfilePhoto:    profile_photo,
			BackgroundPhoto: background_photo,
			Headline:        headline,
			Job:             job,
		}).Error
		return user, err
	}
}

// AddEdu is the resolver for the addEdu field.
func (r *mutationResolver) AddEdu(ctx context.Context, input model.InputEdu) (*model.Education, error) {
	newEdu := &model.Education{
		ID:           uuid.NewString(),
		UserID:       input.UserID,
		School:       input.School,
		Degree:       input.Degree,
		FieldOfStudy: input.FieldOfStudy,
		StartDate:    input.StartDate,
		EndDate:      input.EndDate,
	}

	err := r.DB.Create(&newEdu).Error

	return newEdu, err
}

// AddExp is the resolver for the addExp field.
func (r *mutationResolver) AddExp(ctx context.Context, input *model.InputExp) (*model.Experience, error) {
	newExp := &model.Experience{
		ID:             uuid.NewString(),
		UserID:         input.UserID,
		Title:          input.Title,
		EmploymentType: input.EmploymentType,
		CompanyName:    input.CompanyName,
		Location:       input.Location,
		StartDate:      input.StartDate,
		EndDate:        input.EndDate,
	}

	err := r.DB.Create(&newExp).Error

	return newExp, err
}

// UpdateUserEdu is the resolver for the updateUserEdu field.
func (r *mutationResolver) UpdateUserEdu(ctx context.Context, id string, input model.InputEdu) (*model.Education, error) {
	db := database.GetDB()
	edu := &model.Education{}
	err := db.Model(&edu).Where("id like ?", id).Updates(model.Education{
		Degree:       input.Degree,
		School:       input.School,
		FieldOfStudy: input.FieldOfStudy,
		StartDate:    input.StartDate,
		EndDate:      input.EndDate,
	}).Error

	return edu, err
}

// UpdateUserExp is the resolver for the updateUserExp field.
func (r *mutationResolver) UpdateUserExp(ctx context.Context, id string, input model.InputExp) (*model.Experience, error) {
	db := database.GetDB()
	exp := &model.Experience{}
	err := db.Model(&exp).Where("id like ?", id).Updates(model.Experience{
		Title:          input.Title,
		EmploymentType: input.EmploymentType,
		CompanyName:    input.CompanyName,
		Location:       input.Location,
		StartDate:      input.StartDate,
		EndDate:        input.EndDate,
	}).Error

	return exp, err
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.User, error) {
	db := database.GetDB()
	var user model.User
	err1 := db.Model(user).Where("email LIKE ?", email).Take(&user).Error

	if err1 != nil {
		if err1 == gorm.ErrRecordNotFound {
			return nil, gqlerror.Errorf("the email is not registered yet!")
		}
	}

	if !user.IsActive {
		return nil, gqlerror.Errorf("account is not activated yet!")
	}

	passCheck := CheckPasswordHash(password, user.Password)
	if passCheck {
		return &user, nil
	}

	return nil, gqlerror.Errorf("invalid password!")
}

// ResetEmail is the resolver for the resetEmail field.
func (r *mutationResolver) ResetEmail(ctx context.Context, email string) (string, error) {
	db := database.GetDB()
	var valuser model.User
	err := db.Model(valuser).Where("email LIKE ?", email).Take(&valuser).Error

	if err == gorm.ErrRecordNotFound {
		return "", gqlerror.Errorf("the email is not registered yet!")
	}

	if !valuser.IsActive {
		return "", gqlerror.Errorf("the account is not activated!")
	}

	code := uuid.NewString()
	err1 := SendEmail(email, "forgotPass", code)

	if err1 != nil {
		return "", err1
	}

	var user model.User
	err2 := db.Model(&user).Where("email = ?", email).Update("active_code", code).Error
	return code, err2
}

// CreatePost is the resolver for the createPost field.
func (r *mutationResolver) CreatePost(ctx context.Context, userID string, typeArg string, content string, url string) (*model.Post, error) {
	post := &model.Post{
		ID:          uuid.NewString(),
		UserID:      userID,
		ContentText: content,
		URL:         url,
		Type:        typeArg,
		Likes:       1,
		Comments:    1,
	}

	err := r.DB.Create(&post).Error
	return post, err
}

// CreateJobPost is the resolver for the createJobPost field.
func (r *mutationResolver) CreateJobPost(ctx context.Context, input model.NewJobPost) (*model.JobPost, error) {
	jobPost := &model.JobPost{
		ID:          uuid.NewString(),
		JobName:     input.JobName,
		CompanyName: input.CompanyName,
		Location:    input.Location,
		LogoURL:     input.LogoURL,
	}

	err := r.DB.Create(&jobPost).Error
	return jobPost, err
}

// LikePost is the resolver for the likePost field.
func (r *mutationResolver) LikePost(ctx context.Context, userID string, postID string) (*model.LikedPost, error) {
	db := database.GetDB()
	var post model.Post
	err1 := db.Model(post).Where("id LIKE ?", postID).Take(&post).Error
	if err1 != nil {
		return nil, err1
	}

	numberLikes := post.Likes + 1
	err2 := db.Model(&post).Where("id LIKE ?", postID).Updates(model.Post{
		Likes: numberLikes,
	}).Error

	if err2 != nil {
		return nil, err2
	}

	var likedPost = &model.LikedPost{
		PostID: postID,
		UserID: userID,
	}

	err := r.DB.Create(&likedPost).Error

	return likedPost, err
}

// UnlikePost is the resolver for the unlikePost field.
func (r *mutationResolver) UnlikePost(ctx context.Context, userID string, postID string) (*model.LikedPost, error) {
	db := database.GetDB()
	var post model.Post
	err1 := db.Model(post).Where("id LIKE ?", postID).Take(&post).Error
	if err1 != nil {
		return nil, err1
	}

	numberLikes := post.Likes - 1
	err2 := db.Model(&post).Where("id LIKE ?", postID).Updates(model.Post{
		Likes: numberLikes,
	}).Error

	if err2 != nil {
		return nil, err2
	}

	var likedPost model.LikedPost
	err := db.Where("post_id LIKE ? AND user_id LIKE ?", postID, userID).Delete(&likedPost).Error

	return &likedPost, err
}

// CreateComment is the resolver for the createComment field.
func (r *mutationResolver) CreateComment(ctx context.Context, userID string, postID string, content string) (*model.Comment, error) {
	db := database.GetDB()

	var post model.Post
	err1 := db.Model(post).Where("id LIKE ?", postID).Take(&post).Error
	if err1 != nil {
		return nil, err1
	}

	numberComments := post.Comments + 1
	err2 := db.Model(&post).Where("id like ?", postID).Updates(model.Post{
		Comments: numberComments,
	}).Error

	if err2 != nil {
		return nil, err2
	}

	comment := &model.Comment{
		ID:      uuid.NewString(),
		UserID:  userID,
		Content: content,
		PostID:  postID,
		ReplyID: "",
		Likes:   1,
	}

	err := r.DB.Create(&comment).Error

	return comment, err
}

// CreateReplyComment is the resolver for the createReplyComment field.
func (r *mutationResolver) CreateReplyComment(ctx context.Context, userID string, postID string, commentID string, content string) (*model.Comment, error) {
	comment := &model.Comment{
		ID:      uuid.NewString(),
		UserID:  userID,
		Content: content,
		PostID:  postID,
		ReplyID: commentID,
		Likes:   1,
	}

	err := r.DB.Create(&comment).Error
	return comment, err
}

// LikeComment is the resolver for the likeComment field.
func (r *mutationResolver) LikeComment(ctx context.Context, userID string, commentID string) (*model.LikedComment, error) {

	db := database.GetDB()

	var comment model.Comment
	err1 := db.Model(comment).Where("id LIKE ?", commentID).Take(&comment).Error
	if err1 != nil {
		return nil, err1
	}

	numberLike := comment.Likes + 1
	err2 := db.Model(&comment).Where("id like ?", commentID).Updates(model.Comment{
		Likes: numberLike,
	}).Error

	if err2 != nil{
		return nil, err2
	}

	likeComment := &model.LikedComment{
		UserID:		userID,
		CommentID:	commentID,
	}

	err := r.DB.Create(&likeComment).Error

	return likeComment, err
}

// UnlikeComment is the resolver for the unlikeComment field.
func (r *mutationResolver) UnlikeComment(ctx context.Context, userID string, commentID string) (*model.LikedComment, error) {
	db := database.GetDB()

	var comment model.Comment
	err1 := db.Model(comment).Where("id LIKE ?", commentID).Take(&comment).Error
	if err1 != nil {
		return nil, err1
	}

	numberLike := comment.Likes - 1
	err2 := db.Model(&comment).Where("id like ?", commentID).Updates(model.Comment{
		Likes: numberLike,
	}).Error

	if err2 != nil{
		return nil, err2
	}

	var likedComment model.LikedComment
	err := db.Where("comment_id LIKE ? AND user_id LIKE ?", commentID, userID).Delete(&likedComment).Error

	return &likedComment, err
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	var users []*model.User
	err := r.DB.Find(&users).Error

	return users, err
}

// CurrUser is the resolver for the currUser field.
func (r *queryResolver) CurrUser(ctx context.Context, userID string) (*model.User, error) {
	user := &model.User{ID: userID}
	err := r.DB.First(user).Error

	return user, err
}

// Posts is the resolver for the posts field.
func (r *queryResolver) Posts(ctx context.Context, number int) ([]*model.Post, error) {
	var posts []*model.Post
	err := r.DB.Limit(number).Order("id asc").Find(&posts).Error
	return posts, err
}

// UserInvitations is the resolver for the userInvitations field.
func (r *queryResolver) UserInvitations(ctx context.Context, userID string) ([]*model.ConnectInvitation, error) {
	panic(fmt.Errorf("not implemented: UserInvitations - userInvitations"))
}

// UserEducations is the resolver for the userEducations field.
func (r *queryResolver) UserEducations(ctx context.Context, userID string) ([]*model.Education, error) {
	var educations []*model.Education
	err := r.DB.Where("user_id like ?", userID).Find(&educations).Error

	return educations, err
}

// UserExperiences is the resolver for the userExperiences field.
func (r *queryResolver) UserExperiences(ctx context.Context, userID string) ([]*model.Experience, error) {
	var experiences []*model.Experience
	err := r.DB.Where("user_id like ?", userID).Find(&experiences).Error

	return experiences, err
}

// Comments is the resolver for the comments field.
func (r *queryResolver) Comments(ctx context.Context, postID string, number int) ([]*model.Comment, error) {
	var comments []*model.Comment
	err := r.DB.Where("post_id like ? AND reply_id = ?", postID, "").Limit(number).Find(&comments).Error

	return comments, err
}

// ReplyComments is the resolver for the replyComments field.
func (r *queryResolver) ReplyComments(ctx context.Context, postID string, commentID string, number int) ([]*model.Comment, error) {
	var comments []*model.Comment
	err := r.DB.Where("post_id like ? AND reply_id = ?", postID, commentID).Limit(number).Find(&comments).Error

	return comments, err
}

// LikedComments is the resolver for the likedComments field.
func (r *queryResolver) LikedComments(ctx context.Context, userID string, commentID string) ([]*model.LikedComment, error) {
	var likedComment []*model.LikedComment
	err := r.DB.Where("comment_id LIKE ? AND user_id LIKE ?", commentID, userID).Find(&likedComment).Error

	return likedComment, err
}

// Follows is the resolver for the follows field.
func (r *queryResolver) Follows(ctx context.Context, userID string) ([]*model.FollowedUser, error) {
	panic(fmt.Errorf("not implemented: Follows - follows"))
}

// Followers is the resolver for the followers field.
func (r *queryResolver) Followers(ctx context.Context, userID string) ([]*model.FollowedUser, error) {
	panic(fmt.Errorf("not implemented: Followers - followers"))
}

// Connects is the resolver for the connects field.
func (r *queryResolver) Connects(ctx context.Context, userID string) ([]*model.Connection, error) {
	panic(fmt.Errorf("not implemented: Connects - connects"))
}

// Connectors is the resolver for the connectors field.
func (r *queryResolver) Connectors(ctx context.Context, userID string) ([]*model.Connection, error) {
	panic(fmt.Errorf("not implemented: Connectors - connectors"))
}

// JobPosts is the resolver for the jobPosts field.
func (r *queryResolver) JobPosts(ctx context.Context) ([]*model.JobPost, error) {
	var jobPosts []*model.JobPost
	err := r.DB.Find(&jobPosts).Error

	return jobPosts, err
}

// LikedPosts is the resolver for the likedPosts field.
func (r *queryResolver) LikedPosts(ctx context.Context, userID string, postID string) ([]*model.LikedPost, error) {
	var likedPosts []*model.LikedPost
	err := r.DB.Where("post_id LIKE ? AND user_id LIKE ?", postID, userID).Find(&likedPosts).Error

	return likedPosts, err
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func SendEmail(email string, purpose string, code string) error {
	msg := gomail.NewMessage()
	msg.SetHeader("From", "vbsnet1@gmail.com")
	msg.SetHeader("To", email)
	msg.SetHeader("Subject", "linkhedIn Activation")
	msg.SetBody("text/html", "click this link to reset password! http://localhost:5173/"+purpose+"/"+code)

	n := gomail.NewDialer("smtp.gmail.com", 587, "vbsnet1@gmail.com", "rfwrcbvdqwvnoslk")

	// Send the email
	err := n.DialAndSend(msg)
	return err
}
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
