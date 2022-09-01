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
				Experience:      "",
				Education:       "",
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
		experience := currUser.Experience
		education := currUser.Education

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

		if input.Experience != "" {
			experience = input.Experience
		}

		if input.Education != "" {
			education = input.Education
		}

		err := db.Model(&user).Where("id = ?", id).Updates(model.User{
			FirstName:       first_name,
			LastName:        last_name,
			Email:           email,
			Password:        password,
			ProfilePhoto:    profile_photo,
			BackgroundPhoto: background_photo,
			Headline:        headline,
			Experience:      experience,
			Education:		 education,
		}).Error
		return user, err
	}
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
func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented: Posts - posts"))
}

// UserPosts is the resolver for the userPosts field.
func (r *queryResolver) UserPosts(ctx context.Context, userID string) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented: UserPosts - userPosts"))
}

// UserInvitations is the resolver for the userInvitations field.
func (r *queryResolver) UserInvitations(ctx context.Context, userID string) ([]*model.ConnectInvitation, error) {
	panic(fmt.Errorf("not implemented: UserInvitations - userInvitations"))
}

// Comments is the resolver for the comments field.
func (r *queryResolver) Comments(ctx context.Context, postID string) ([]*model.Comment, error) {
	panic(fmt.Errorf("not implemented: Comments - comments"))
}

// LikedComments is the resolver for the likedComments field.
func (r *queryResolver) LikedComments(ctx context.Context, userID string, commentID int) ([]*model.LikedComment, error) {
	panic(fmt.Errorf("not implemented: LikedComments - likedComments"))
}

// LikedPost is the resolver for the likedPost field.
func (r *queryResolver) LikedPost(ctx context.Context, userID string, postID int) ([]*model.LikedPost, error) {
	panic(fmt.Errorf("not implemented: LikedPost - likedPost"))
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
